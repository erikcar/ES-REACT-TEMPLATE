import { useApp, useVM, ViewModel, core, Repeater } from "@essenza/react";
import { Outlet } from "react-router-dom";
import { Dropdown } from "antd";
import React from 'react';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import Logo from "../assets/img/logo.png";
import { TbBrandGoogleHome } from "react-icons/tb";

export function MainLayout({ token }) {
  const app = useApp();
  const vm = useVM(LayoutVM);
  return (
    <div className="bg-gradient-to-t bg-[#002a3a] h-screen flex flex-col">
      <div className="flex items-center px-4 md:px-10 pt-1 static top-0 w-full z-0">
        <img src={Logo} alt="Logo" className="max-h-6 flex-none" />
        <TbBrandGoogleHome className="flex-none text-white text-2xl cursor-pointer ml-4" onClick={() => app.navigate("home")} />

        <Repeater css-selected="p-1" onSelect={e => vm.menuNav(e.key)} source={vm.items} />

        { app.role.authorize("ADMIN") && <IoMdSettings className="flex-none text-white text-2xl cursor-pointer mr-2" onClick={() => app.navigate("settings")} /> }
        {/* <FaUser onClick={() => app.navigate("profile")} className="flex-none text-white text-2xl cursor-pointer" /> */}
        <Dropdown menu={{items: vm.uitems, onClick: e => vm.menuNav(e.key)}} trigger={['click']}>
          <FaUser className="flex-none text-black text-2xl cursor-pointer" />
        </Dropdown>
      </div>
      <div className="pb-4 pt-1 px-2 md:px-4 flex-1  flex">
        <div className="px-2 md:px-4 pb-2 w-full bg-[#e3e7e9] rounded-md overflow-auto">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export function LayoutVM() {
  ViewModel.call(this);
  this.current = "agenda";
  this.items = [
    {
      label: 'AREA A',
      key: 'home',
      //icon: <MailOutlined />,
    },
    {
      label: 'AREA B',
      key: 'home1',
      //icon: <AppstoreOutlined />,
    },
    {
      label: 'AREA C',
      key: 'home2',
      //icon: <AppstoreOutlined />,
    },
  ];

  this.uitems = [
    {
      label: 'Accesso e sicurezza',
      key: 'profile',
      //icon: <MailOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Esci',
      key: 'LOGOUT',
      //icon: <AppstoreOutlined />,
    },
  ];
}

core.prototypeOf(ViewModel, LayoutVM, {
  menuNav(key) {
    if (key === "LOGOUT") {
      this.context.session.logout();
    }
    else {
      this.current = key;
      this.context.navigate(key);
    }
  },

  intent: { //swipe or override
    MENU_NAV: function ({ context, data }) {
      this.current = data;
      context.navigate(data);
    },
  }
});
