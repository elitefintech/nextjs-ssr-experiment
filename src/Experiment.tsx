import React, {useState, useEffect, useContext} from 'react';
import {Props as VariantProps} from './Variant';
import Cookies from 'js-cookie';
import {ExperimentContext} from './ExperimentProvider';
import ReactDOM from 'react-dom';
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
    pickVariant: (variants: React.ReactElement<Variant, any>[]) => string;
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
        pickVariant: pPickVariant,
        children,
    } = props;
    const debugUriParam = `experiment_${pName}_debug`;
    const [debug, setDebug] = useState(props.debug ?? false);
    const [cookies, setCookies] = useContext(ExperimentContext);
    const [variant, setVariant] = useState(
        cookies[encodeURIComponent(props.name)]
            ? cookies[encodeURIComponent(props.name)] : "default"
    );
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (variant === null) {
            const variants = children.map(el => el.props);
            const pickedVariant = pPickVariant ? pPickVariant(children) : pickVariant(variants);
            setVariant(pickedVariant);
        }
    }, [pPickVariant, children, variant]);

    useEffect(() => {
        if (!pDebug) {
            setDebug(window.location.href.indexOf(debugUriParam) > -1);
        }
    }, [pDebug, debugUriParam]);

    useEffect(() => {
        if (variant !== null) {
            let newCookies: any = {};
            if (cookies) {
                newCookies = {
                    ...cookies,
                    [encodeURIComponent(pName)]: variant,
                };
            }
            if (JSON.stringify(cookies) !== JSON.stringify(newCookies)) {
                setCookies(newCookies);
                Cookies.set(pName, `${variant}`, {
                    expires: pMAX_AGE ?? MAX_AGE,
                });
            }
        }
    }, [variant, pMAX_AGE, pName, cookies, setCookies]);

    function removeExperiment(experimentName: string) {
        let newCookies: any = {};
        if (cookies) {
            newCookies = {...cookies};
        }
        const {[encodeURIComponent(experimentName)]: _, ...trimmedCookies} =
            newCookies;
        Cookies.remove(experimentName);
        setCookies(trimmedCookies);
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

    /**
     * Open debug settings dialog
     */
    const handleOpen = () => {
        setOpen(true);
    };

    /**
     * Close debug settings dialog
     */
    const handleClose = () => {
        setOpen(false);
    };

    function debugChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVariant(e.currentTarget.value);
    }

    return (
        <>
            {childrenWithProps.length < 2 ? childrenWithProps : null}
            {variant !== "default" ? childrenWithProps.find(el => el.key == variant) : null}

            {typeof document !== 'undefined' && debug
                ? ReactDOM.createPortal(
                    <button
                        style={{
                            position: 'relative',
                            bottom: '0',
                            margin: '.5rem',
                            zIndex: '9999',
                        }}
                        onClick={handleOpen}
                    >
                        A/B {props.name} ({variant || "null" + 1}∈
                        {childrenWithProps.length})
                    </button>,
                    props.debugRoot ||
                    (document.querySelector('body') as HTMLElement)
                )
                : null}

            {typeof document !== 'undefined' && debug ? (
                <Debug
                    debugChange={debugChange}
                    handleClose={handleClose}
                    handleRemoveExperiment={removeExperiment}
                    open={open}
                    name={props.name}
                    variant={variant}
                >
                    {childrenWithProps}
                </Debug>
            ) : null}
        </>
    );
}
