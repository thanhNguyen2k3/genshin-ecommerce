import { Form, Input, Space } from 'antd';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons';
import { ICity, ICountry } from 'country-state-city';
import styled from 'styled-components';

type Props = {
    data: ICountry[];
    selected: ICountry;
    setSelected: Dispatch<SetStateAction<any>>;
};

const StyleCombobox = styled(Combobox)`
    border: 2px solid #ccc;
    margin-bottom: 10px;
    border-radius: 2px;
    &:focus-visible {
        border-color: #ccc !important;
    }
`;

const StypeComboboxInput = styled(Combobox.Input)`
    border-radius: 2px;
    border-color: #ccc;
`;

const SelectedCountry = ({ data, selected, setSelected }: Props) => {
    const [query, setQuery] = useState('');

    const filteredPeople =
        query === ''
            ? data
            : data.filter((person) =>
                  person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
              );

    return (
        <StyleCombobox value={selected} onChange={setSelected}>
            <div className="relative mt-1">
                <div className="relative z-0 w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <StypeComboboxInput
                        className="w-full relative border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(person) => (person as any).name}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <CaretDownOutlined className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {filteredPeople.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filteredPeople.map((person, index) => (
                                <Combobox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                    value={person}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {person.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active ? 'text-white' : 'text-teal-600'
                                                    }`}
                                                >
                                                    <CheckOutlined className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </StyleCombobox>
    );
};

export default SelectedCountry;
