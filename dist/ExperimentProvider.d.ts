import React from 'react';
import Cookies from 'js-cookie';
declare type Cookies = {
    [experimentName: string]: string;
};
export declare const ExperimentContext: React.Context<[Cookies, (cookies: Cookies) => void]>;
interface Props {
    initialState?: Cookies;
    [x: string]: any;
}
export declare function ExperimentProvider(props: Props): JSX.Element;
export {};
