import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { techUsed } from '../../assets/helpers/block-text';
import './Navigation.css';
import logo from '../../assets/images/logo-original-white-transparency.png';

function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div id='landing-nav-container'>
			<NavLink
				exact to="/"
				id='landing-nav-home'
			>
				<img
					alt='logo'
					id='landing-nav-logo'
					src={logo}
				/>
				Biscord
			</NavLink>
			<div id='landing-nav-mid-container'>
				{techUsed.map(str => (
					<span
						key={str}
						className='landing-nav-text'
					>{str}</span>
				))}
			</div>
			{isLoaded && (
				<ProfileButton user={sessionUser} />
			)}
		</div>
	);
}

export default Navigation;
