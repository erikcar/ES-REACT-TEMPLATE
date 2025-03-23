const recast = require("recast");
const fs = require('fs');
const http = require("http");
const { array } = require("yup");

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS'); //OPTIONS, GET
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  res.setHeader("Access-Control-Allow-Headers", "*")
  const url = req.url;
  let data = '';
  console.log("POST", req.method);
  if (req.method === 'OPTIONS') {
    /*
    Allow: GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS
Access-Control-Allow-Origin: https://reqbin.com
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS
Access-Control-Allow-Headers: Content-Type
    */
    res.end();
  }
  if (req.method === 'POST') {
    req.on('data', chunk => data += chunk.toString());
    req.on('end', () => {
      console.log("POST-DATA", data);
      if (url === "/api/update") {
        //console.log("POST-DATA", data);
        const json = JSON.parse(data);
        const info = EntityManager.updateOrCreate(json);
        res.end(JSON.stringify(info));
        //res.end("OK");
      }
    });
    req.on('error', (error) => {
      console.error('Error:', error.message);
    });
  }

  if (url === "/api/entity") {
    const info = await EntityManager.readAll();
    res.end(JSON.stringify(info));
  }

  else if (url === "/api/entity_edit") {
    const info = await EntityManager.updateOrCreate(data);
    res.end(JSON.stringify(info));
  }
  else if (url === "/") {
    res.end("Hello World\n");
  }
  else if (url === "/api") {
    res.end("Hello Api\n");
  }
});

//fs.readFileSync("config.json", 'utf8'); poi leggo da qui parametri
const PORT = 3001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const baseurl = "http://mmf.digitalremake.it/";//"http://localhost:5008/";//"http://mmf.digitalremake.it/";// "http://mmf.digitalremake.it/";//

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

async function CallApi(api, data) {
  try {
    const params = new URLSearchParams();

    if (data) {
      for (let key in data) {
        params.append(key, data[key]);
      }
    }

    const config = {
      method: "post",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: params
    };

    console.log("CallApi: ", baseurl + 'essenza/' + api, config)
    const res = await fetch(baseurl + 'Essenza/' + api, config);
    console.log("CallApi Response: ", res)
    /*const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
    console.log('Status Code:', res.status);
    console.log('Date in Response header:', headerDate);*/
    const result = await res.json();
    console.log("CALL API " + api + ": ", result);
    return { data: result, ok: true };

  } catch (err) {
    console.log(err.message, err);
    return { error: err.message, ok: false }//can be console.error
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const EntityManager = {
  readAll: async function () {
    const result = { isError: false }
    const response = await CallApi("einfo");
    //console.log("RESPONSE:", response);

    if (response.ok) {
      result.entities = response.data;
      result.config = this.readConfig();
      const config = result.config;
      //Chiamate per ciascun entities
      for (let k = 0; k < result.entities.length; k++) {
        const entity = result.entities[k];
        entity.model = this.readModel(entity.name);
        let el = { etype: entity.name, kind: 'CONFIG', fields: [], crud: 0, name: "Config" };
        entity.elements = [el];
        let fields = config[entity.name];
        if (fields) {
          for (let z = 0; z < entity.fields.length; z++) {
            const field = entity.fields[z];
            if (fields.hasOwnProperty(field.name)) {
              el.fields.push({ ...field, label: field.name, original: true, ctype: field.dtype });
            }
          }
        }
      }
    }
    else {
      result.isError = true;
    }

    return result;
  },

  readConfig() {
    const source = fs.readFileSync("src/config.js", 'utf8');
    const ast = recast.parse(source);
    const entities = {};

    recast.visit(
      ast,
      {
        visitCallExpression: function (path) {
          //console.log("path", path.node);
          if (path.node.callee.property.name === "configureType") {
            const obj = new AstObject(path.node.arguments[0]);
            console.log("SCHEMA: ", path.node.arguments[0]);
            obj.forEach(p => {
              //console.log("property", p.key.name);
              let props = {};
              let fields = new AstObject(p.value).findObject("fields");
              fields.forEach(field => {
                props[field.key.name] = field.value.name;
                //console.log("field", field.key.name, field.value.name);
              });
              entities[p.key.name] = props;
            });
            return false;
          }
          else
            this.traverse(path);
        },
      }
    );

    return entities;
  },

  readModel(etype) {
    let model = false;
    const path = "src/data/" + etype + ".js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  readCard(etype) {
    let model = false;
    const path = "src/widget/" + etype + "/card.js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  readTable(etype) {
    let model = false;
    const path = "src/widget/" + etype + "/card.js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  readList(etype) {
    let model = false;
    const path = "src/widget/" + etype + "/card.js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  readView(etype) {
    let model = false;
    const path = "src/widget/" + etype + "/card.js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  readWidget(etype) {
    let model = false;
    const path = "src/widget/" + etype + "/card.js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  readVista(etype) {
    let model = false;
    const path = "src/widget/" + etype + "/card.js";
    if (fs.existsSync(path)) {
      const source = fs.readFileSync(path, 'utf8');
      const ast = recast.parse(source);
      console.log("MODEL AST:", ast);
      model = true;
    }
    return model;
  },

  useComponent(ast, api, vista) {
    const b = ast.builder;
    ast.importReact();
    ast.importES("ViewModel, useData");
    ast.import(capitalize(api.etype) + "Model", "../../data/" + api.etype);
    const component = ast.createElement(capitalize(api.etype) + api.name, vista)
    const view = component.view;
    view.push(b.variableDeclaration("let", [b.variableDeclarator(b.arrayPattern([b.identifier("data")]), ast.callExp("useData", null, [b.memberExpression(b.identifier("vm"), b.identifier("model"))]))]));
    let model = b.expressionStatement(b.assignmentExpression("=", b.memberExpression(b.thisExpression(), b.identifier("model")), ast.callExp("inject", b.thisExpression(), [capitalize(api.etype) + "Model"])))
    component.constructor.push(model);
    return component;
  },

  TABLE(api, vista) {
    let ast = new ESFile((vista ? "src/vista/" : "src/widget/") + api.etype + "/" + api.name + ".js");
    const b = ast.builder;
    ast.importReact("useMemo");
    ast.importAntd("Table");
    ast.import("MdOutlineFolderOpen,MdOutlineDeleteSweep", "react-icons/md");

    let component = this.useComponent(ast, api, vista);
    const view = component.view;
    view.push(b.variableDeclaration("const", [b.variableDeclarator(b.identifier("columns"), ast.callExp("useMemo", null, [
      b.arrowFunctionExpression([], ast.callExp("cols", null, ["vm"])),
      b.arrayExpression([b.identifier("vm")])]))]));

    const jsx = component.jsx;
    const table = jsx.createChild("Table");
    table.addLiteral("rowKey", "id");
    table.addIdentifier("columns");
    table.addIdentifier("pagination", "null");// b.nullLiteral()
    table.addExp("dataSource", ast.callExp("commit", "vm", ["data"]));

    let f = ast.createFunction("cols", "vm");
    let columns = [];
    let fields = api.fields;
    if (fields) {
      for (let k = 0; k < fields.length; k++) {
        const field = fields[k];
        columns.push(ast.objectExp(["title", field.label, "dataIndex", field.name, "key", "id", "width", 80]))
      }
    }

    let div = new JSX("div");
    div.addLiteral("className", "flex gap-2 items-center text-right");

    const open = div.createChild("MdOutlineFolderOpen");
    open.addLiteral("className", "flex gap-2 items-center text-right");
    open.addExp("onClick", b.arrowFunctionExpression([], b.blockStatement([b.expressionStatement(ast.callExp("detail", "vm", ["record"]))])));

    const del = div.createChild("MdOutlineDeleteSweep");
    del.addLiteral("className", "flex gap-2 items-center text-right");
    del.addExp("onClick", b.arrowFunctionExpression([], b.blockStatement([b.expressionStatement(ast.callExp("delete", "vm", ["record"]))])));

    columns.push(ast.objectExp(["title", " ", "key", "id", "render", b.arrowFunctionExpression([b.identifier("text"), b.identifier("record")], b.blockStatement([b.returnStatement(div.source)]))]));

    f.push(b.returnStatement(b.arrayExpression(columns)));
    ast.save();
  },

  FORM(api, vista) {
    let ast = new ESFile((vista ? "src/vista/" : "src/widget/") + api.etype + "/" + api.name + ".js");
    const b = ast.builder;

    ast.importES("useFormUI, Form, FormItem");

    let component = this.useComponent(ast, api, vista);
    let formatter = [];

    const jsx = component.jsx;

    const form = jsx.createChild("Form");
    form.addIdentifier("form");
    form.addLiteral("layout", "horizontal");
    form.addLiteral("className", "flex gap-3 flex-wrap");
    let fields = api.fields;

    let item, el;
    for (let k = 0; k < fields.length; k++) {
      const field = fields[k];
      item = form.createChild("FormItem");
      item.addLiteral("label", field.label || field.name);
      item.addLiteral("name", field.name);
      if (field.dtype === "varchar") {
        ast.importAntd("Input");
        item.createChild("Input");
      }
      else if (field.dtype === "bool") {
        ast.importAntd("CheckBox");
        item.createChild("CheckBox");
      }
      else if (field.dtype === "int4" || field.dtype === "int8") {
        ast.importAntd("Select");
        item.createChild("Select");
      }
      else if (field.dtype === "date" || field.dtype === "timestamptz") {
        ast.importAntd("DatePicker");
        ast.importES("DateFormatter");
        el = item.createChild("DatePicker");
        el.addLiteral("format", "DD/MM/YYYY");
        el.addLiteral("pipe", "DD/MM/dayjs");
        formatter.push(field.name, b.identifier("DateFormatter"));
      }
      else {
        {
          ast.importAntd("Input");
          item.createChild("Input");
        }
      }
    }

    const view = component.view;
    view.push(b.variableDeclaration("const", [b.variableDeclarator(b.identifier("form"), ast.callExp("useFormUI", null, [
      capitalize(api.etype) + api.name, "data",
      ast.objectExp(["rules", b.memberExpression(b.identifier("vm"), b.identifier("rules")), "formatter", ast.objectExp(formatter)])]))]));

    ast.save();
  },

  WIDGET(api, vista) {
    let ast = new ESFile((vista ? "src/vista/" : "src/widget/") + api.etype + "/" + api.name + ".js");
    //const b = ast.builder;
    let component = this.useComponent(ast, api, vista);
    const jsx = component.jsx;
    const div = jsx.createChild("div");
    div.addLiteral("className", "flex gap-2");
    ast.save();
  },

  VISTA(el) {
    this.WIDGET(el, true);
  },

  MODEL(el) {
    let ast = new ESFile("src/data/" + el.etype + ".js");
    const b = ast.builder;
    const props = [];
    if (el.queries) {
      for (const key in el.queries) {
        props.push(key);
        const query = el.queries[key]; //{name: "item", type: "ExecuteQuery", params: "a"}
        const params = [b.literal(query.name)];
        if (query.params) {
          query.params.split(',').forEach(p => params.push(p.trim()));
        }
        props.push(ast.functExp(query.params, null, [b.returnStatement(ast.callExp(query.type, b.thisExpression(), params))]))
      }
    }
    if (ast.isEmpty) {
      ast.importES("DataModel, core");
      let model = ast.createFunction(capitalize(el.etype) + "Model", null, true);
      let exp = ast.callSta("call", "DataModel", [b.thisExpression()]);
      model.push(exp);
      props.unshift("etype", el.etype);
      ast.push(ast.callSta("prototypeOf", "core", ["DataModel", capitalize(el.etype) + "Model", ast.objectExp(props)]))
    }
    ast.save();
  },

  CONFIG(el) {
    const source = fs.readFileSync("src/config.js", 'utf8');
    const ast = recast.parse(source);
    const b = recast.types.builders;
    //console.log(recast.print(ast).code);
    recast.visit(
      ast,
      {
        visitCallExpression: function (path) {
          //console.log("path", path.node);
          if (path.node.callee.property.name === "configureType") {
            const obj = new AstObject(path.node.arguments[0]);
            let entity = obj.findObject(el.etype);
            let value = b.objectExpression(el.fields.map(field => b.property('init', b.identifier(field.name), b.identifier(field.dtype))));
            if (entity === null) {
              entity = b.objectExpression([b.objectProperty(b.identifier("fields"), value)]);
              obj.add(b.objectProperty(b.identifier(el.etype), entity));
            }
            else {
              let fields = entity.find("fields");
              fields.value = value;
            }
            return false;
          }
          this.traverse(path);
        },
      }
    )
    fs.writeFileSync("src/config.js", recast.print(ast).code);
  },

  updateOrCreate(schema) {
    if (!schema || !Array.isArray(schema)) return;
    schema.forEach(el => this[el.kind](el));
  },

  /*updateOrCreateCard(entity) {
    const ast = new AST("src/widget/" + entity.etype + "/card.js");
    if (ast.hasContent) {
      ;
    }
    else {
      const b = AST.build();
      ast.import("React", "react");
      b.importDeclaration
    }
  }*/
}

function ESFile(path) {
  this.path = path;
  this.source = this.parsePath(path);
  this.body = this.source.program.body;
  this.builder = recast.types.builders;
  this.modules = new Map();
  this.isEmpty = true;
}

ESFile.prototype = {
  parsePath(path) {
    this.isEmpty = path && !fs.existsSync(path);
    const dir = path.substr(0, path.lastIndexOf("/"));
    console.log("path", path, dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    return this.isEmpty ? recast.parse("") : recast.parse(fs.readFileSync(this.path, 'utf8'), {
      parser: require("recast/parsers/babel")
    });
  },

  parse(source) {
    this.source = recast.parse(source);
  },

  build: () => recast.types.builders,

  import(name, module, def) {
    const b = this.builder;
    //const specifier = def ? [b.importDefaultSpecifier(b.identifier(name))] : name.split(',').map(n => b.importSpecifier(b.identifier(n.trim())));
    if (this.modules.has(module)) {
      const m = this.modules.get(module);
      name.split(',').forEach(n=>{
        let name = n.trim();
        if (!m.elements.has(name)) {
          m.elements.add(name);
          m.dec.specifiers.push(def ? b.importDefaultSpecifier(b.identifier(name)) :b.importSpecifier(b.identifier(name)));
        }
      })
      
    } else {
      const dec = b.importDeclaration( def ? [b.importDefaultSpecifier(b.identifier(name))] : name.split(',').map(n => b.importSpecifier(b.identifier(n.trim()))), b.literal(module));
      this.body.unshift(dec);
      this.modules.set(module, { elements: new Set(name.split(',').map(n =>n.trim())), dec: dec });
    }
  },

  importReact(name) {
    !name ? this.import("React", "react", true) : this.import(name, "react");
  },

  importES(name) {
    !name ? this.import("essenza", "@essenza/react", true) : this.import(name, "@essenza/react");
  },

  importAntd(name) {
    !name ? this.import("Input", "antd", true) : this.import(name, "antd");
  },

  createElement(name, vista) {
    const el = new ESElement(name, this, vista);
    this.body.push(el.view.source, el.viewModel);
    return el;
  },

  createFunction(name, params, exp) {
    const b = this.builder;
    const body = [];
    const f = b.functionDeclaration(b.identifier(name), params ? params.split(',').map(n => b.identifier(n.trim())) : [], b.blockStatement(body));
    this.body.push(exp ? b.exportDeclaration(false, f) : f);
    return body;
  },

  functDec(params, name, body) {
    const b = this.builder;
    return b.functionDeclaration(name ? b.identifier(name) : null, params ? params.split(',').map(n => b.identifier(n.trim())) : [], b.blockStatement(body || []));
  },

  functExp(params, name, body) {
    const b = this.builder;
    return b.functionExpression(name ? b.identifier(name) : null, params ? params.split(',').map(n => b.identifier(n.trim())) : [], b.blockStatement(body || []));
  },

  callExp(callee, member, params) {
    const b = this.builder;
    callee = b.identifier(callee);
    if (member) {
      console.log("member: ", member, typeof member === 'string');
      callee = b.memberExpression(typeof member === 'string' ? b.identifier(member) : member, callee);
    }
    if (Array.isArray(params)) {
      for (let k = 0; k < params.length; k++) {
        const p = params[k];

        if (typeof p === 'string') params[k] = b.identifier(p);
      }
    }
    return b.callExpression(callee, params || []);
  },

  callSta(callee, member, params) {
    const b = this.builder;
    return b.expressionStatement(this.callExp(callee, member, params));
  },

  objectExp(props) {
    const b = this.builder;
    const properties = [];
    for (var k = 0; k < props.length; k += 2) {
      var p = props[k + 1];
      if (typeof p === 'string' || typeof p === 'number') {
        properties.push(b.property("init", b.identifier(props[k]), b.literal(p)));
      }
      else {
        properties.push(b.property("init", b.identifier(props[k]), p));
      }
    }
    return b.objectExpression(properties);
  },

  push(el) {
    this.body.push(el);
  },
  /*get body() {
    return this.source.program.body;
  },*/
  save(path) {
    fs.writeFileSync(path || this.path, recast.print(this.source).code);
  },

  get hasContent() {
    return this.source !== null;
  }
}

function ESView(root, vista) {
  this.root = root;
  const b = recast.types.builders;
  const prop = b.property("init", b.identifier("vm"), b.identifier("vm"));
  prop.shorthand = true;
  this.params = [prop];
  this.jsx = new Fragment();
  this.jsxRoot = b.returnStatement(this.jsx.source);
  this.body = [this.jsxRoot];
  console.log("BEFORE VIEW SOURCE");
  this.source = b.functionDeclaration(b.identifier(vista ? "Vista" : "View"), [b.objectPattern(this.params)], b.blockStatement(this.body));
}

ESView.prototype = {
  useForm() {

  },

  useData() {

  },

  push(el) {
    this.body.unshift(el);
  }
}

function ESElement(name, root, vista) {
  this.root = root;
  const b = recast.types.builders;
  this.name = name;
  this.view = new ESView(root, vista);
  this.constructor = [];
  this.vm = [b.property("init", b.literal(vista ? "@vista" : "@view"), b.identifier(vista ? "Vista" : "View")),
  b.property("init", b.literal("$$constructor"), b.functionExpression(null, [], b.blockStatement(this.constructor))),
  b.property("init", b.literal("@observe"), b.objectExpression([]))
  ];
  this.viewModel = b.exportNamedDeclaration(b.variableDeclaration("const", [b.variableDeclarator(b.identifier(name), b.callExpression(b.memberExpression(b.identifier("ViewModel"), b.identifier("create")), [b.objectExpression(this.vm)]))]))
  root.importES("ViewModel");
  this.builder = b;
  this.formatter = null;
}

ESElement.prototype = {
  get jsx() {
    return this.view.jsx;
  },
}



function JSXAttribute(name, value, kind) {
  this.name = name;
  this.value = value;
  this.kind = kind;
}

JSXAttribute.prototype = {
  toAst() {
    const b = recast.types.builders;
    if (this.kind === "Literal") {
      return b.jsxAttribute(b.jsxIdentifier(this.name), b.literal(this.value));
    }
    else if (this.kind === "Identifier") {
      return b.jsxAttribute(b.jsxIdentifier(this.name), b.jsxExpressionContainer(b.identifier(this.value)));
    }
    else if (this.kind === "Exp") {
      return b.jsxAttribute(b.jsxIdentifier(this.name), b.jsxExpressionContainer(this.value));
    }
    else if (this.kind === "vmexp") {
      return b.jsxAttribute(b.jsxIdentifier(this.name), b.jsxExpressionContainer(b.arrowFunctionExpression([], b.callExpression(b.memberExpression(b.identifier("vm"), b.identifier(this.value))))));
    }
  }
}

function Fragment() {
  const b = recast.types.builders;
  this.children = [];
  this.source = b.jsxFragment(b.jsxOpeningFragment(), b.jsxClosingFragment(), this.children);
}

Fragment.prototype = {
  addChild(jsx) {
    this.children.push(jsx.source);
  },

  createChild(name) {
    const jsx = new JSX(name);
    this.addChild(jsx);
    return jsx;
  },

  toAst() {
    //const b = recast.types.builders;
    //return b.jsxFragment(b.jsxOpeningFragment(), b.jsxClosingFragment(), this.children.map(child => child.toAst()))
    this.source.children = this.children.map(child => child.toAst());
  }
}

function JSX(name) {
  //Fragment.call(this);
  const b = recast.types.builders;
  this.name = name;
  this.children = [];
  this.attributes = [];
  this.source = b.jsxElement(b.jsxOpeningElement(b.jsxIdentifier(name), this.attributes, true), null, this.children);
}

JSX.prototype = {
  constructor: {
    value: JSX,
    enumerable: false,
    writable: true,
    configurable: true,
  },
  addChild(jsx) {
    const b = recast.types.builders;
    if (this.children.length === 0) {
      this.source.openingElement.selfClosing = false;
      this.source.selfClosing = false;
      this.source.closingElement = recast.types.builders.jsxClosingElement(b.jsxIdentifier(this.name));
    }
    //console.log("ADD CHILD: ", jsx.source);
    this.children.push(b.jsxText("\n\t\t\t"), jsx.source, b.jsxText("\n\t\t"));
  },

  createChild(name) {
    const jsx = new JSX(name);
    this.addChild(jsx);
    return jsx;
  },

  addLiteral: function (name, value) {
    this.attributes.push(new JSXAttribute(name, value, "Literal").toAst());
  },

  addIdentifier(name, value) {
    this.attributes.push(new JSXAttribute(name, value || name, "Identifier").toAst());
  },

  addExp(name, value) {
    this.attributes.push(new JSXAttribute(name, value, "Exp").toAst());
  },

  addVMExpression(name, value) {
    this.attributes.push(new JSXAttribute(name, value, "vmexp").toAst());
  },

  toAst() {
    const b = recast.types.builders;
    const empty = this.children.length === 0;
    const element = b.jsxElement(b.jsxOpeningElement(this.name, this.attributes.map(attr => attr.toAst()), empty), empty ? null : b.jsxClosingElement(this.name), this.children.map(child => child.toAst()));
    return element;
  }
};

/*EntityManager.MODEL({
  etype: "editors", queries: {
    getEntity: { name: "http://localhost:3001/api/entity", type: "ExecuteQuery" },
    update: { name: "http://localhost:3001/api/update", type: "ExecuteApi", params: "a" }
  }
});*/

/*EntityManager.FORM({
  etype: "thread", name: "card", fields: [
    { name: "name", label: "Nome", dtype: "bool" },
    { name: "surname", label: "Cognome", dtype: "varchar" },
    { name: "city", label: "Citta", dtype: "int4" },
    { name: "date", label: "Data", dtype: "date" },
  ]
});*/

/*let ast = new ESFile("prova.js");

ast.importReact();
//ast.importReact("useEffect, useRef");
const jsx = ast.createElement("ProvaCard").jsx;

const form = jsx.createChild("Form");
form.addLiteral("className", "flex");
//let item = 
form.createChild("FormItem");
/*let item = form.createChild("FormItem");
item.addLiteral("label", "Nome");
item.addLiteral("name", "name");
ast.save();*/

function AstObject(source) {
  this.source = source;
}

AstObject.prototype = {
  constructor: {
    value: AstObject,
    enumerable: false,
    writable: true,
    configurable: true,
  },
  forEach: function (callBack) {
    this.source.properties.forEach(callBack);
  },

  find(name) {
    return this.source.properties.find(p => p.key.name === name);
  },

  findObject(name) {
    let p = this.find(name);
    if (p) {
      return new AstObject(p.value);
    }
    return null;
  },

  add(prop) {
    //Prima dovrei controllare che sia una AST object property
    this.source.properties.push(prop);
  },

  remove(prop) {
    return prop;
  }
};