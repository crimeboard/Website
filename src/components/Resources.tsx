import React, { useState } from 'react';

const Resources = (props) => {

	//const [user, setUser] = useState(props.user);
	const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated);
	//const [userID, setUserID] = useState(props.userID);

	React.useEffect(() => {
		console.log("Relationships.js useEffect(): props.isAuthenticated="+ props.isAuthenticated +", props.userID="+ JSON.stringify(props.userID));	//== undefined
		if (props.isAuthenticated === undefined) {
			setIsAuthenticated(false);
		}
		else {
			setIsAuthenticated(props.isAuthenticated);
			//setUserID(props.userID);
		}
	}, [props.isAuthenticated]);

	return (
		<div className="groupContent">
			<ul className="withTop5pxMargin">
				<li>Tools/DataSets
					<ul>
						<li><a href="https://docs.google.com/spreadsheets/d/18rtqh8EG2q1xBo2cLNyhIDuK9jrPGwYr9DI2UncoqJQ/edit#gid=930747607"
							target="_blank" rel="noreferrer">Bellingcat tools/resources</a></li>
						<li><a href="https://web.archive.org" target="_blank" rel="noreferrer">Web Archive</a> 					- Website history</li>
						<li><a href="https://www.whois.com/" target="_blank" rel="noreferrer">Whois</a>						 	- Website registrar</li>
						<li><a href="https://securitytrails.com" target="_blank" rel="noreferrer">DNS History</a> 				- SecurityTrails</li>
						<li><a href="https://whoisology.com/" target="_blank" rel="noreferrer">DNS History</a> 					- Whoisology</li>
						<li><a href="https://haveibeenpwned.com/" target="_blank" rel="noreferrer">Have I been Pwned?</a>		- Email compromised?</li>
						<li><a href="https://www.maltego.com" target="_blank" rel="noreferrer">Professional Network Analysis + Graphing</a> - Maltego</li>
						<li><a href="https://tineye.com" target="_blank" rel="noreferrer">Reverse Image Search</a></li>
						<li>Remini - AI Photo Enhancer - mobile only?</li>
						<li><a href="https://projects.propublica.org/nonprofits/" target="_blank" rel="noreferrer">Political funding groups</a></li>						
						<li><a href="https://coronavirus.jhu.edu/map.html" target="_blank" rel="noreferrer">John Hopkins University</a> - Trumps Virus</li>
						<li><a href="https://ourworldindata.org" target="_blank" rel="noreferrer">Our World In Data</a></li>
						<li><a href="https://www.wolframalpha.com" target="_blank" rel="noreferrer">Wolfram Alpha</a> 			- Data driven search engine</li>
						<li><a href="https://www.virustotal.com" target="_blank" rel="noreferrer">Virus Total</a>				- Malicious/Virus infected website network graphs</li>
						<li><a href="https://www.opensecrets.org" target="_blank" rel="noreferrer">Open Secrets</a> 			- documenting corruption</li>
						<li><a href="https://prospect.org/mapping-corruption-interactive" target="_blank" rel="noreferrer">Trump corruption listed by departments</a> 	- documenting corruption</li>
						{isAuthenticated === false && (
							<li>Social Media
								<ul>
									<li>- Login to view -</li>
								</ul>
							</li>
						)}
						{isAuthenticated === true && (
							<>
								<li>Social Media
									<ul>
										<li><a href="https://hoaxy.osome.iu.edu/" target="_blank" rel="noreferrer">Hoaxy</a> 	- Social media networks</li>
										<li><a href="https://socialbearing.com/search/user" target="_blank" rel="noreferrer">Social Bearing</a>	 - Social media timeline analytics</li>
									</ul>
								</li>
							</>
						)}
						<li>@threadreaderapp please unroll	- command to unroll recent twitter threads</li>
						<li>@threader_app compile 			- command to unroll old twitter threads</li>
						<li>Geospatial
							<ul>
								<li><a href="https://www.flightradar24.com/" target="_blank" rel="noreferrer">Air Traffic</a></li>
								<li><a href="https://www.marinetraffic.com/" target="_blank" rel="noreferrer">Marine Traffic</a></li>
							</ul>
						</li>
						<li>Insurrection at US Capital Jan 6 2021
							<ul>
								<li><a href="https://capitolmap.com/" target="_blank" rel="noreferrer">Facial recognition + Map</a>	- by <a href="https://twitter.com/patr10tic" target="_blank" rel="noreferrer">@patr10tic</a></li>
							</ul>
						</li>
						<li>Datasets hacked by Anonymous
							<ul>
								<li><a href="https://ddosecrets.com/wiki/Distributed_Denial_of_Secrets" target="_blank" rel="noreferrer">Home page - all datasets + includes link to show by country</a></li>
								<li><a href="https://ddosecrets.com/wiki/Oath_Keepers" target="_blank" rel="noreferrer">Oath Keepers hack revealing members within US Police</a></li>
								<li><a href="https://ddosecrets.com/wiki/BlueLeaks" target="_blank" rel="noreferrer">Blue Leaks - 269 GB of internal U.S. law enforcement data</a></li>
								<li><a href="https://ddosecrets.com/wiki/Epik" target="_blank" rel="noreferrer">Epik hack revealing far-right members identies</a></li>
								<li><a href="https://ddosecrets.com/wiki/Council_for_National_Policy" target="_blank" rel="noreferrer">Council for National Policy (CNP) hack revealing members</a></li>
							</ul>
						</li>
					</ul>
				</li>

				<li>People to follow on Twitter:
					<ul>
						<li><a href="https://twitter.com/jzikah" target="_blank" rel="noreferrer">@jzikah</a> 					- fun maps galore</li>
						<li><a href="https://twitter.com/jimstewartson" target="_blank" rel="noreferrer">@jimstewartson</a> 	- crime fighter</li>
						<li><a href="https://twitter.com/Redrum_of_Crows" target="_blank" rel="noreferrer">@Redrum_of_Crows</a> - QAnon networks + other interesting research</li>
						<li><a href="https://twitter.com/AmericanHacker" target="_blank" rel="noreferrer">@AmericanHacker</a> 	- IT networks?</li>
						<li><a href="https://twitter.com/ThatNotoriousK" target="_blank" rel="noreferrer">@ThatNotoriousK</a>	- Anonymous</li>
						<li><a href="https://twitter.com/hifi_the16th" target="_blank" rel="noreferrer">@hifi_the16th</a> 		- High Fidelity</li>					
						<li><a href="https://twitter.com/bellingcat" target="_blank" rel="noreferrer">@bellingcat</a> 			- investigations</li>
						<li><a href="https://twitter.com/OCCRP" target="_blank" rel="noreferrer">@OCCRP</a> 					- investigations (transnational corruption)</li>
						<li><a href="https://twitter.com/DeSmogBlog" target="_blank" rel="noreferrer">@DeSmogBlog</a> 			- investigations (environmental)</li>
						<li><a href="https://twitter.com/NLong72" target="_blank" rel="noreferrer">@NLong72</a> 				- unknown</li>
						<li><a href="https://twitter.com/DevinCow" target="_blank" rel="noreferrer">@DevinCow</a> 				- internets favorite herbivore</li>
						<li><a href="https://twitter.com/davetroy" target="_blank" rel="noreferrer">@davetroy</a> 				- investigations</li>
						<li><a href="https://twitter.com/opendemocracy" target="_blank" rel="noreferrer">@opendemocracy</a> 	- investigations</li>
						<li><a href="https://twitter.com/TheYoungTurks" target="_blank" rel="noreferrer">@TheYoungTurks</a> 	- shows with in-depth background</li>
						<li><a href="https://twitter.com/sparrowmedia" target="_blank" rel="noreferrer">@sparrowmedia</a> 		- investigations</li>
						<li><a href="https://twitter.com/emptywheel" target="_blank" rel="noreferrer">@emptywheel</a> 			- investigations</li>
						<li><a href="https://twitter.com/MalcolmNance" target="_blank" rel="noreferrer">@MalcolmNance</a> 		- former US intelligence officer and author</li>
						<li><a href="https://twitter.com/HindsightFiles" target="_blank" rel="noreferrer">@HindsightFiles</a> 	- Cambridge Analytica whistleblower Brittany Kaiser</li>
						<li><a href="https://twitter.com/BaddCompani" target="_blank" rel="noreferrer">@BaddCompani</a> 		- unknown</li>
						<li><a href="https://twitter.com/MingGao26" target="_blank" rel="noreferrer">@MingGao26</a> 			- unknown</li>
						<li><a href="https://twitter.com/MaryPatFlynn1" target="_blank" rel="noreferrer">@MaryPatFlynn1</a> 	- investigations</li>
						<li><a href="https://twitter.com/ATafoyovsky" target="_blank" rel="noreferrer">@ATafoyovsky</a> 		- unknown</li>
						<li><a href="https://twitter.com/clearing_fog" target="_blank" rel="noreferrer">@clearing_fog</a> 		- unknown</li>
						<li><a href="https://twitter.com/bakerstherald" target="_blank" rel="noreferrer">@bakerstherald</a> 	- UK investigations</li>
						<li><a href="https://twitter.com/sophie_e_hill" target="_blank" rel="noreferrer">@sophie_e_hill</a> 	- using R language/graphics for UK Gov investigations - <a href="https://www.sophie-e-hill.com/slides/my-little-crony/" target="_blank" rel="noreferrer">Little Crony - UK Corruption</a></li>
						<li><a href="https://twitter.com/petestrzok" target="_blank" rel="noreferrer">@petestrzok</a> 			- Former FBI</li>
						<li><a href="https://twitter.com/rocco_castoro" target="_blank" rel="noreferrer">@rocco_castoro</a> 	- unknown</li>
						<li><a href="https://twitter.com/OlgaNYC1211" target="_blank" rel="noreferrer">@OlgaNYC1211</a> 		- Russia, Ukraine</li>
						<li><a href="https://twitter.com/MysterySolvent" target="_blank" rel="noreferrer">@MysterySolvent</a> 	- unknown</li>	
						<li><a href="https://twitter.com/LibbyInPhilly" target="_blank" rel="noreferrer">@LibbyInPhilly</a> 	- unknown</li>
						<li><a href="https://twitter.com/amagicwindow" target="_blank" rel="noreferrer">@amagicwindow</a> 		- investigations</li>
						<li><a href="https://twitter.com/MuellerSheWrote" target="_blank" rel="noreferrer">@MuellerSheWrote</a> - unknown</li>
						<li><a href="https://twitter.com/Tentoads4truth" target="_blank" rel="noreferrer">@Tentoads4truth</a> 	- Koch corruption</li>
						<li><a href="https://twitter.com/Lynette30067504" target="_blank" rel="noreferrer">@Lynette30067504</a> - "The Warning Bell"</li>
						<li><a href="https://twitter.com/coolfinish" target="_blank" rel="noreferrer">@coolfinish</a> 			- unknown</li>
						<li><a href="https://twitter.com/SpiroAgnewGhost" target="_blank" rel="noreferrer">@SpiroAgnewGhost</a> - unknown</li>		
						<li><a href="https://twitter.com/capitolhunters" target="_blank" rel="noreferrer">@capitolhunters</a> 	- tracking seditionists</li>		
						<li><a href="https://twitter.com/SeditionHunters" target="_blank" rel="noreferrer">@SeditionHunters</a> - tracking seditionists</li>		
						<li><a href="https://twitter.com/1600pennpooch" target="_blank" rel="noreferrer">@1600pennpooch</a> 	- tracking seditionists</li>		
						<li><a href="https://twitter.com/ProjectLincoln" target="_blank" rel="noreferrer">@ProjectLincoln</a> 	- former Republican group</li>
						<li><a href="https://twitter.com/AccountableGOP" target="_blank" rel="noreferrer">@AccountableGOP</a> 	- former Republican group</li>
						<li><a href="https://twitter.com/glennkirschner2" target="_blank" rel="noreferrer">@glennkirschner2</a> - 30 year prosecutor</li>
						<li><a href="https://twitter.com/MichaelAvenatti" target="_blank" rel="noreferrer">@MichaelAvenatti</a> - Imprisoned by Billy Barr</li>
					</ul>
				</li>

				<li>Journalists to follow on twitter:
					<ul>
						<li>QAnon
							<ul>
								<li><a href="https://twitter.com/oneunderscore__" target="_blank" rel="noreferrer">@oneunderscore__</a> - Ben Collins reporter NBC</li>
								<li><a href="https://twitter.com/drewharwell" target="_blank" rel="noreferrer">@drewharwell</a>    - Drew Harwell tech reporter Washington Post</li>
								<li><a href="https://twitter.com/tmclaughlin3" target="_blank" rel="noreferrer">@tmclaughlin3</a>   - Timothy McLaughlin reporter The Atlantic, Washington Post &amp; Wired</li>
								<li><a href="https://twitter.com/ajvicens" target="_blank" rel="noreferrer">@ajvicens</a> 			- A.J. Vicens reporter Motherjones</li>
								<li><a href="https://twitter.com/alibreland" target="_blank" rel="noreferrer">@alibreland</a>     	- Ali Breland reporter Motherjones</li>
							</ul>
						</li>
						<li>Political
							<ul>
								<li><a href="https://twitter.com/maddow" target="_blank" rel="noreferrer">@maddow</a>				- MSBC</li>
								<li><a href="https://twitter.com/MollyJongFast" target="_blank" rel="noreferrer">@MollyJongFast</a>	- @thedailybeast - Molly: "Too much Republican fuqqery"</li>
								<li><a href="https://twitter.com/AshaRangappa_" target="_blank" rel="noreferrer">@AshaRangappa_</a>	- Lawyer/CNN</li>
								<li><a href="https://twitter.com/JoyAnnReid" target="_blank" rel="noreferrer">@JoyAnnReid</a></li>
								<li><a href="https://twitter.com/chrislhayes" target="_blank" rel="noreferrer">@chrislhayes</a></li>
								<li><a href="https://twitter.com/NicolleDWallace" target="_blank" rel="noreferrer">@NicolleDWallace</a></li>
								<li><a href="https://twitter.com/AliVelshi" target="_blank" rel="noreferrer">@AliVelshi</a></li>
								<li><a href="https://twitter.com/AriMelber" target="_blank" rel="noreferrer">@AriMelber</a></li>
								<li><a href="https://twitter.com/jaketapper" target="_blank" rel="noreferrer">@jaketapper</a></li>								
								<li><a href="https://twitter.com/ryanjreilly" target="_blank" rel="noreferrer">@ryanjreilly</a> 	- HuffPost</li>
								<li><a href="https://twitter.com/JoeNBC" target="_blank" rel="noreferrer">@JoeNBC</a>				- NBC</li>
								<li><a href="https://twitter.com/BWilliams" target="_blank" rel="noreferrer">@BWilliams</a>			- 11th Hour</li>
								<li><a href="https://twitter.com/JuddLegum" target="_blank" rel="noreferrer">@JuddLegum</a>			- "politics and power"</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>Political Groups to follow on twitter
					<ul>
						<li><a href="https://twitter.com/ProjectLincoln" target="_blank" rel="noreferrer">@ProjectLincoln</a>			- American political action group (helped save America)</li>
						<li><a href="https://twitter.com/AccountableGOP" target="_blank" rel="noreferrer">@AccountableGOP</a> / @RVAT	- American political action group (helped save America)</li>
						<li><a href="https://twitter.com/votevets" target="_blank" rel="noreferrer">@votevets</a>						- American political action group (helped save America)</li>
						<li><a href="https://twitter.com/TeamJoe" target="_blank" rel="noreferrer">@TeamJoe</a>							- American political action group (helped save America)</li>			   
					</ul>
				</li>
				<li>Political Folk to follow on twitter
					<ul>
						<li><a href="https://twitter.com/RepSwalwell" target="_blank" rel="noreferrer">@RepSwalwell</a>					- Eric Swalwell</li>
						<li><a href="https://twitter.com/tedlieu" target="_blank" rel="noreferrer">@tedlieu</a>							- Ted Lieu</li>
						<li><a href="https://twitter.com/RepKatiePorter" target="_blank" rel="noreferrer">@RepKatiePorter</a>			- Rep Katie Porter</li>
						<li><a href="https://twitter.com/RepRaskin" target="_blank" rel="noreferrer">@RepRaskin</a>						- Rep Jamie Raskin</li>
						<li><a href="https://twitter.com/RepAdamSchiff" target="_blank" rel="noreferrer">@RepAdamSchiff</a>				- Rep Adam Schiff</li>				   
						<li><a href="https://twitter.com/SenWhitehouse" target="_blank" rel="noreferrer">@SenWhitehouse</a>				- Sen Whitehouse</li>
						<li><a href="https://twitter.com/SteveSchmidtSES" target="_blank" rel="noreferrer">@SteveSchmidtSES</a>			- Steve Schmitt</li>				   
						<li><a href="https://twitter.com/reedgalen" target="_blank" rel="noreferrer">@reedgalen</a>						- Reed Galen</li>				   
						<li><a href="https://twitter.com/TheRickWilson" target="_blank" rel="noreferrer">@TheRickWilson</a>				- Rick Wilson</li>				   
					</ul>
				</li>				
				<li>Legal to follow on twitter
					<ul>
						<li><a href="https://twitter.com/glennkirschner2" target="_blank" rel="noreferrer">@glennkirschner2</a>			- Glenn Kirschner, 30 year former prosecutor</li>
					</ul>
				</li>
				<li>Podcasts
					<ul>
						<li><a href="https://podcasts.apple.com/us/podcast/the-lincoln-project/id1551582052" target="_blank" rel="noreferrer">Lincoln Project hosted by Reed Galen</a>	- very informative</li>
						<li><a href="https://podcasts.apple.com/us/podcast/the-new-abnormal/id1508202790" target="_blank" rel="noreferrer">The New Abnormal hosted by MollyJongFast</a>	- very informative</li>
						<li><a href="https://podcasts.apple.com/us/podcast/the-world-beneath/id1566145058" target="_blank" rel="noreferrer">The World Beneath</a>	- transnational economic corruption</li>
						<li><a href="https://podcasts.apple.com/us/podcast/justice-matters-with-glenn-kirschner/id1526751534" target="_blank" rel="noreferrer">Justice Matters with Glenn Kirschner</a>	- former prosecutor</li>
					</ul>
				</li>
			</ul>
		</div>
	)
}

export default Resources;

