import React from 'react';

interface Props {
    name: string;
    debugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    open: boolean;
    handleClose: () => void;
    handleRemoveExperiment: (experimentName: string) => void;
    variant: string;
    [x: string]: any;
}

export function Debug(props: Props) {
    function handleRemoveExperiment() {
        props.handleRemoveExperiment(props.name);
    }

    return (
        <div>
            <section>
                <h2>
                    {props.name}
                    <span
                        onClick={handleRemoveExperiment}
                        title="Remove experiment cookie">

                    </span>
                </h2>
                {props.children.map(
                    (child: React.ReactElement, idx: number) => (
                        <label key={child.props.name}>
                            <input
                                type="radio"
                                value={child.props.variant}
                                name={props.name}
                                onChange={props.debugChange}
                                checked={child.props.variant === props.variant}
                            />
                            {child.props.name}
                        </label>
                    )
                )}
            </section>
        </div>
    );
}
