import React from 'react';
import { createContext, useState } from 'react';
import Cookies from 'js-cookie';

type Cookies = {
    [experimentName: string]: string;
};

export const ExperimentContext = createContext<[Cookies, (cookies: Cookies) => void]>([
    {},
    console.log,
]);

interface Props {
    initialState?: Cookies;
    [x: string]: any;
}

export function ExperimentProvider(props: Props) {
    const [cookies, setCookies] = useState(
        props.initialState || Cookies.get() || {}
    );

    return (
        <ExperimentContext.Provider value={[cookies, setCookies]}>
            {props.children}
        </ExperimentContext.Provider>
    );
}
