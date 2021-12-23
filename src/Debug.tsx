import React from 'react';

interface Props {
    name: string;
    debugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    open: boolean;
    handleClose: () => void;
    handleRemoveExperiment: (experimentName: string) => void;
    variant: number | string;
    [x: string]: any;
}

export function Debug(props: Props) {
    function handleRemoveExperiment() {
        props.handleRemoveExperiment(`experiment_${props.name}`);
        window.location = window.location;
    }

    return (
        <div style={{width: '100%', position: 'fixed', bottom: 3, left: 0}}>
            <section style={{
                margin: '0 auto',
                background: '#101f30',
                color: 'white',
                fontFamily: 'Lato, Arial, Verdana',
                width: '350px',
                maxWidth: '500px',
                padding: '10px',
                borderRadius: '8px',
                border: '3px solid rgba(255, 255, 255, 0.5)',
            }}>
                <table>
                    <thead>
                        <tr>
                            <td align="right"><strong>Experiment:</strong></td>
                            <td>{props.name}</td>
                        </tr>
                        <tr>
                            <td align="right"><strong>Variant:</strong></td>
                            <td>{props.variant}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.children.map(
                            (child: React.ReactElement) => (
                                <tr key={`experiment_debug_variant_${child.props.name}`}>
                                    <td align="right"><label key={child.props.name} /></td>
                                    <td>
                                        <input
                                            type="radio"
                                            value={child.props.name}
                                            name={props.name}
                                            onChange={props.debugChange}
                                            checked={child.props.name === props.variant}
                                        />
                                        &nbsp;&nbsp;
                                        {child.props.name}
                                    </td>
                                </tr>
                            )
                        )}
                        <tr>
                            <td colSpan={2} align="center">
                                <button onClick={handleRemoveExperiment}>
                                    Remove experiment cookie
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
