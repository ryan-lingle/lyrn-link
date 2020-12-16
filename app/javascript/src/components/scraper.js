import React, { useEffect, useContext } from 'react';
import { Form } from '../components';
import Context from '../context';

const Scraper = ({ onSubmit }) => {
    const { api, state } = useContext(Context);

    function scrape({ target }) {
        api.scrape(target.value);
    };

    function handleSubmit(params) {
        onSubmit(params);
        api.store.reduce({
            type: 'scrape',
            result: {},
        });
    }

    useEffect(() => {
        return () => {
            api.store.reduce({
                type: 'scrape',
                result: {},
            });
        };
    }, [])

    const loading = state.loading.scrape;
    const error = state.errors.scrape;
    const result = state.scrapeResult;

    return(
        <div>
            <img src={result.image} width="300px" />
            <Form
                onSubmit={handleSubmit}
                submitCopy="Create Item"
                type="items"
                inputs={[
                    {
                        label: 'Url',
                        key: 'url',
                        type: 'text',
                        onChange: scrape
                    },
                    {
                        label: 'Title',
                        key: 'title',
                        type: 'text',
                        defaultValue: result.title,
                    },
                    {
                        key: 'description',
                        type: 'hidden',
                        defaultValue: result.description,
                    },
                    {
                        type: 'hidden',
                        key: 'image_url',
                        defaultValue: result.image,
                    }
                ]}
            />
        </div>
    );
}

export default Scraper;