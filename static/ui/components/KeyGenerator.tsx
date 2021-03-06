import * as React from 'react';
import { Prompt } from './Prompt';
import { SideBar } from './SideBar';
import { PathSelector } from './PathSelector';
import { SeedContainer } from './SeedContainer';
import './sass/KeyGenerator.scss';

interface byteScheme {
	desc: string;
	bytes: number;
	active: number;
	updateSelected: (number) => number;
}

interface byteSelector {
	selected: number;
	updateSelected: (number) => number;
}

const ByteScheme = ({desc, bytes, active, updateSelected}:byteScheme) => {
	const byteclass = (bytes === active) ? "activebyte" : "bytes";
	const updateActivity = () => {
		updateSelected(bytes);
	}
	return (<div className={byteclass} onClick={updateActivity}>{desc}</div>);
}

const ByteSelector = ({selected, updateSelected}:byteSelector) => {
	// bytes of entropy/words in seed phrase - 16/12, 20/15, 24/18, 28/21, 32/24
	return (<div id="byteselector">
		<ByteScheme desc={"12 words"} bytes={16} active={selected} updateSelected={updateSelected}/>
		<ByteScheme desc={"15 words"} bytes={20} active={selected} updateSelected={updateSelected}/>
		<ByteScheme desc={"18 words"} bytes={24} active={selected} updateSelected={updateSelected}/>
		<ByteScheme desc={"21 words"} bytes={28} active={selected} updateSelected={updateSelected}/>
		<ByteScheme desc={"24 words"} bytes={32} active={selected} updateSelected={updateSelected}/>
	</div>);
}

export const KeyGenerator = () => {
	const [pass, updatePass] = React.useState('');
	const [selected, updateSelected] = React.useState(32);
	const [phrase, updatePhrase] = React.useState(null);
	const [seed, updateSeed] = React.useState(null);
	const [m_xprv, updateMxprv] = React.useState(null);
	const [m_xpub, updateMxpub] = React.useState(null);
	const [phraseType, updatePhraseType] = React.useState("password");
	const [toggle, updateToggle] = React.useState('hidden');
	const [path, updatePath] = React.useState('Native SegWit');

	const prompt1 = 'Select a scheme of 12, 15, 18, 21, or 24 words (hint: 24 words is by far the most secure)';
	const prompt2 = 'Enter a passphrase to protect your wallet (This optional and would be needed to recover your wallet)';
	const prompt3 = 'Select whether you want keys for Legacy (P2PKH), SegWit (P2SH-P2WPKH), or Native SegWit (P2WPKH) addresses';

	const update_pass = async (event) => { 
		updatePass(event.target.value);
		if (event.target.value === "" && toggle !== "hidden") {
			updatePhraseType("password");
			updateToggle("hidden");
		}
	}

	const submit_params = async () => {
		// gather desired passphrase and word count
		const resp = await fetch('/generate', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"bytes": selected, "passphrase": pass, "addr": path})});
		const data = await resp.json();
		console.log(data);
		if (data["phrase"] === "failed") {
			console.log('failed');
			updatePhrase(null);
			updateSeed(null);
			updateMxprv(null);
			updateMxpub(null);
			return;
		}
		updatePhrase(data["phrase"]);
		updateSeed(data["seed"]);
		updateMxprv(data["m_xprv"]);
		updateMxpub(data["m_xpub"]);
	}

	const toggleDisplay = () => {
		if (pass === "") return;
		if (toggle === "hidden") {
			// display the password
			updateToggle("hidden displayed");
			updatePhraseType("text");
		} else {
			// hide the password
			updatePhraseType("password");
			updateToggle("hidden");
		}
	}

	return (<div className="generator-app">
	<SideBar/>
	<div className="generator">
		<div className='selector-box'>
		<ByteSelector selected={selected} updateSelected={updateSelected}/>
			<div className="password-elements">
			<input className="pass passphrase" type={phraseType} placeholder={"Enter your HD wallet passphrase here"} title={"HD Wallet Passphrase"} onChange={update_pass} autoComplete={"off"}/><div className={`password-hider ${toggle}`} onClick={toggleDisplay}></div></div>
			<PathSelector path={path} updatePath={updatePath}/>
			<div className="generator-wrapper">
				<button className="submitbutton" onClick={submit_params}>Generate Seed</button>
			</div>
		</div>
		<div className="generatorbox">
			{(phrase && seed) ? <SeedContainer phrase={phrase} seed={seed} m_xprv={m_xprv} m_xpub={m_xpub}/> : <Prompt texts={[prompt1, prompt2, prompt3]}/>}
		</div>
	</div></div>);
}
