import React from 'react';
import { 
    ErrorBox, Loader, ListTabs, GenericTabs, 
    ProfileTabs, MobileTabs, List, UserProfile, 
    UnconfirmedEmail, ItemShow } from '../components';
import { Helmet } from 'react-helmet';
import { withStuff } from "../hocs";

const PageWrapper = ({ state, api, children, pageHeight, tabs=true }) => {
    
    // move to HOC
    if (state.admin && state.user.confirm_email) return <UnconfirmedEmail email={state.user.email} />;

    const pathname = state.readOnly ? `/${state.user.handle}/` : '/admin/';

    return(
        <div>
            <Helmet>
                <title>
                    {
                        state.readOnly

                        ?   `${state.user.name} (${state.user.handle}) / Lyrnlink`

                        :   'Lyrnlink'
                    }
                </title>
            </Helmet>
            <div className="page" style={{ height: `${pageHeight}px` }} >
                <div id="side-nav" className="non-mobile-only">
                    <UserProfile />
                    <ProfileTabs
                        tabs={state.user.tabs}
                        pathname={state.readOnly ? `/${state.user.handle}/` : '/admin/'}
                    />
                    <div className="nav-footer">
                        <div>
                            <a style={{fontWeight: 'bolder'}}>© 2021 - Lyrnlink</a>
                        </div>
                        <div>
                            <a style={{color: '#333333'}} href="https://www.lyrn.link/privacy">Privacy Policy</a>
                            &nbsp;&nbsp;&nbsp;
                            <a style={{color: '#333333'}} href="https://www.lyrn.link/terms">Terms of Use</a>
                        </div>
                    </div>
                </div>
                <div className="mobile-only">
                    <UserProfile />
                    <div className="mobile-only">
                        <MobileTabs 
                            pathname={state.readOnly ? `/${state.user.handle}/` : '/admin/'}
                        />
                    </div>
                </div>
                <div className="container">
                    {
                        tabs

                        ?   state.tab === 'lists' 

                            ?   <ListTabs 
                                    pathname={pathname + 'lists/'} 
                                /> 

                            :   <GenericTabs 
                                    pathname={pathname + state.tab + '/'}
                                    tabs={api.store.currentTab()} 
                                />
                        :   null
                    }
                    {children}
                </div>
            </div>
        </div>
    );
}

export default withStuff(PageWrapper, {
    api: true,
    state: true,
    effect: ({ match }) => {
        const { handle } = match.params || {};
        if (handle && !localStorage.getItem('affiliate')) {
            localStorage.setItem('affiliate', handle);
        }
    },
});
