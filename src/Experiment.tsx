import React, {useState, useEffect, useContext} from 'react';
import {Props as VariantProps} from './Variant';
import Cookies from 'js-cookie';
import {ExperimentContext} from './ExperimentProvider';
import {Debug} from './Debug';
import {Props as Variant} from './Variant';

interface ExperimentProps {
    debug?: boolean;
    debugRoot?: HTMLElement;
    name: string;
    onClick?: (
        event: React.MouseEvent<HTMLElement>,
        experimentName: string,
        variantName: string
    ) => void;
    onRunExperiment?: (experimentName: string, variantName: string) => void;
    children: React.ReactElement<VariantProps, any>[];
    MAX_AGE?: number;
}

function pickVariant(variants: Variant[]): string {
    let total = 0;
    for (let i = 0; i < variants.length; ++i) {
        total += variants[i].weight;
    }

    const threshold = Math.random() * total;
    total = 0;
    for (let i = 0; i < variants.length - 1; ++i) {
        total += variants[i].weight;

        if (total >= threshold) {
            return variants[i].name;
        }
    }

    return variants[variants.length - 1].name;
}

const MAX_AGE = 30; // 30 days

export function Experiment(props: ExperimentProps) {
    const {
        debug: pDebug,
        MAX_AGE: pMAX_AGE,
        name: pName,
        children,
    } = props;
    const debugUriParam = `experiment_${pName}_debug`;
    const cookieName = `experiment_${pName}`;
    const [debug, setDebug] = useState(props.debug ?? false);
    const [cookies, setCookies] = useContext(ExperimentContext);
    const [variant, setVariant] = useState(
        cookies[encodeURIComponent(cookieName)]
            ? cookies[encodeURIComponent(cookieName)]
            : -1
    );
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (variant === -1) {
            const pickedVariant = pickVariant(children.map(el => el.props));
            setVariant(pickedVariant);
        }
    }, [children, variant]);

    useEffect(() => {
        if (!pDebug) {
            setDebug(window.location.href.indexOf(debugUriParam) > -1);
        }
    }, [pDebug, debugUriParam]);

    useEffect(() => {
        if (variant !== -1) {
            let newCookies: any = {};
            if (cookies) {
                newCookies = {
                    ...cookies,
                    [encodeURIComponent(cookieName)]: variant,
                };
            }
            if (JSON.stringify(cookies) !== JSON.stringify(newCookies)) {
                setCookies(newCookies);
                Cookies.set(cookieName, `${variant}`, {
                    expires: pMAX_AGE ?? MAX_AGE,
                });
            }
        }
    }, [variant, pMAX_AGE, cookieName, cookies, setCookies]);

    function removeExperimentCookie(experimentName: string) {
        console.log(`removing experiment named ${experimentName}`);
        Cookies.remove(experimentName);
    }

    const childrenWithProps = React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {
            onClick: (
                e: React.MouseEvent<HTMLElement>,
                variantName: string
            ) => {
                if (props.onClick) {
                    props.onClick(e, props.name, variantName);
                }

                if (child.props.onClick) {
                    child.props.onClick(e, variantName);
                }
            },
            onRunVariant: (variantName: string) => {
                if (props.onRunExperiment) {
                    props.onRunExperiment(props.name, variantName);
                }
                if (child.props.onRunVariant) {
                    child.props.onRunVariant(variantName);
                }
            },
        });
    });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function debugChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVariant(e.currentTarget.value);
    }

    const experimentContent = childrenWithProps.length < 2 ? childrenWithProps[0] :
        childrenWithProps.length >= 2 && typeof variant === 'string'
            ? childrenWithProps.find((child: React.ReactElement) => child.props.name == variant) : null

    return (
        <>
            {experimentContent !== null ?  experimentContent : (
                <span>
                    <br /><br />loading experiment ...<br /><br />
                </span>
            )}

            {typeof document !== 'undefined' && debug ? (
                <>
                    <Debug
                        debugChange={debugChange}
                        handleClose={handleClose}
                        handleRemoveExperiment={removeExperimentCookie}
                        open={open}
                        name={props.name}
                        variant={variant}
                    >
                        {childrenWithProps}
                    </Debug>
                </>
            ) : null}
        </>
    );
}
