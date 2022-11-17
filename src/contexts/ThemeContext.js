import React from 'react';

export const ThemeContext = React.createContext({mode:'dark'});

export const themeMap = {
    dark:{
        body:'bg-gray-700',
        nav:'bg-zinc-900 text-white',
        footer:'bg-zinc-900 text-white',
        button:'bg-cyan-300 hover:bg-gray-100',
        link:'text-white hover:text-cyan-400 hover:border-b-cyan-400',
        text:'text-white'
    },
    light:{
        body:'bg-gray-100',
        nav:'bg-zinc-300',
        footer:'bg-zinc-300',
        button:'bg-cyan-500 text-white hover:bg-gray-700',
        link:'hover:border-b-zinc-600',
        text:'text-zinc-900'
    }
};