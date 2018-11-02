// @flow
import React from 'react';
import {default as PhoneComponent} from '../../../components/Phone';
import type {FieldTypeProps} from '../../../types';

export default class Phone extends React.Component<FieldTypeProps<?string>> {
    render() {
        const {dataPath, error, onChange, onFinish, value} = this.props;

        return (
            <PhoneComponent
                id={dataPath}
                onBlur={onFinish}
                onChange={onChange}
                valid={!error}
                value={value}
            />
        );
    }
}
