import React,{ useEffect, useState } from 'react';
import { capitalize, observer } from '../utils';
import { InfoTooltip } from '../components';


const Table = ({ schema, data, style, id, onLinkClick, fetchMore, onDestroy, destroyCondition }) => {
    const keys = Object.keys(schema);

    const [sort, setSort] = useState([getDefaultSort(), true]);

    function getDefaultSort() {
        const keys = Object.keys(schema);

        const defaultSort = keys.find(key => schema[key].defaultSort);
        return defaultSort || keys[0];
    };

    if (fetchMore) useEffect(() => {
        const streamObserver = observer(() => {

            fetchMore({ offset: data.length });
            streamObserver.unobserve(sb);

        });

        const sb = document.getElementById("table-bottom");

        if (sb) streamObserver.observe(sb);

    }, [ data.length ]);

    function buildDestroy(datum) {
        if (!onDestroy) {
            return null;
        } else if (!destroyCondition || destroyCondition(datum)) {
            return(
                <td className="destroy-row" >
                    <i className="fa-solid fa-trash-alt" 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this item?')) {
                                e.target.parentNode.parentNode.style.display = 'none';
                                onDestroy(datum.id);
                            }
                        }}
                    />
                </td>
            );
        } else {
            return <td></td>;
        }
    }

    const Row = (datum) => {
        return(
            <tr>
                {keys.map((key, i) => {
                    if (key === 'id' || schema[key].hide) 
                        return null;

                    if (schema[key].children) 
                        return(
                            <td 
                                key={key} 
                                style={{
                                    textAlign: schema[key].textAlign,
                                    fontWeight: schema[key].bold ? 'bold' : '',
                                    width: schema[key].width,
                                }}
                                onClick={() => schema[key].link && onLinkClick && onLinkClick(datum.id)}
                            >
                                {schema[key].children({ datum })}
                            </td>
                        );

                    return(
                        <td
                            style={{
                                textAlign: schema[key].textAlign,
                                fontWeight: schema[key].bold ? 'bold' : '',
                                width: schema[key].width,
                            }}
                            key={i}
                            onClick={() => schema[key].link && onLinkClick && onLinkClick(datum.id)}
                        >
                            {
                                datum[key]
                                ?   datum[key]
                                :   <strong>--</strong>
                            }
                        </td>
                    );
                })}
                {buildDestroy(datum)}
            </tr>
        );
    };

    function sortEm(data) {
        data = data.sort((a, b) => {
            if (sort[1]) {
                return a[sort[0]] > b[sort[0]] ? 1 : -1;
            } else {
                return a[sort[0]] > b[sort[0]] ? -1 : 1;
            }
        });
        keys.forEach(schemaKey => {
            if (schema[schemaKey].permaSort) {
                 data = data.sort((a, b) => {
                    return a[schemaKey] > b[schemaKey] ? -1 : 1;
                 });
            };
        });
        return data;
    }


    return(
        <div className="table-wrapper">
            <table style={style} id={id} >
                <thead>
                    <tr>
                        {keys.map((key, i) =>
                            !schema[key] || schema[key].hide 
                                ?   null

                                :   <th
                                        style={{
                                            textAlign: schema[key].textAlign,
                                            width: schema[key].width,
                                        }}
                                        key={i}
                                        onDoubleClick={(e) => e.preventDefault()}
                                        onClick={() => 
                                            schema[key].onClick

                                                ?   schema[key].onClick()

                                                :   setSort(prev => {
                                                        const s = [];
                                                        s[0] = key;
                                                        s[1] = key == prev[0] ? !prev[1] : true;
                                                        return s;
                                                    })
                                        }
                                    >   
                                        {
                                            schema[key].icon

                                                ?   <i className={schema[key].icon} />

                                                :   null
                                        }
                                        <span>{schema[key].label || capitalize(key)}</span>
                                        {
                                           schema[key].info

                                                ?   <InfoTooltip copy={schema[key].info} />

                                                :   null
                                        }
                                        {   
                                            key == sort[0]

                                                ?   <i className={`fa-solid fa-sort-${sort[1] ? 'down' : 'up'}`} />

                                                :   null
                                        }

                                    </th>
                        )}
                        {
                                onDestroy

                                ?   <th></th>
                                
                                :   null
                            }
                    </tr>
                </thead>
                <tbody>
                    {sortEm(data).map((datum, i) =>
                        <Row {...datum} key={i} />
                    )}
                </tbody>
            </table>
            <div id="table-bottom"></div>
        </div>
    );
}

export default Table;