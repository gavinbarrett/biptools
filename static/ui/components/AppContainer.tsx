import * as React from 'react';
import * as Router from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { KeyGenerator } from './KeyGenerator';
import { Recover } from './Recover';
import { Download } from './Download';
import { Documentation } from './Documentation';
import { PrivacyPolicy } from './PrivacyPolicy';
import './sass/AppContainer.scss';

export const AppContainer = () => {
	return (<Router.Switch>
			<Router.Route path='/' exact render={() => <LandingPage/>}/>
			<Router.Route path='/generate' render={() => <KeyGenerator/>}/>
			<Router.Route path='/recover' render={() => <Recover/>}/>
			<Router.Route path='/download' render={() => <Download/>}/>
			<Router.Route path='/documentation' render={() => <Documentation/>}/>
			<Router.Route path='/privacy' render={() => <PrivacyPolicy/>}/>
		</Router.Switch>);
}
