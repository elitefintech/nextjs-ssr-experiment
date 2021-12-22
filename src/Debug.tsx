import React from 'react';

interface Props {
    name: string;
    debugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    open: boolean;
    handleClose: () => void;
    handleRemoveExperiment: (experimentName: string) => void;
    variant: number;
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
                                value={idx}
                                name={props.name}
                                onChange={props.debugChange}
                                checked={idx === props.variant}
                            />
                            {child.props.name}
                        </label>
                    )
                )}
            </section>
        </div>
    );
}
