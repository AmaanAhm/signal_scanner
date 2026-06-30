import { o as __toESM } from "../_runtime.mjs";
import { E as isRedirect, g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DaGqjhcO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-2gAvkcCh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var NSE_500 = [
	{
		symbol: "RELIANCE.NS",
		name: "Reliance Industries"
	},
	{
		symbol: "TCS.NS",
		name: "Tata Consultancy Services"
	},
	{
		symbol: "HDFCBANK.NS",
		name: "HDFC Bank"
	},
	{
		symbol: "BHARTIARTL.NS",
		name: "Bharti Airtel"
	},
	{
		symbol: "ICICIBANK.NS",
		name: "ICICI Bank"
	},
	{
		symbol: "INFY.NS",
		name: "Infosys"
	},
	{
		symbol: "SBIN.NS",
		name: "State Bank of India"
	},
	{
		symbol: "LICI.NS",
		name: "Life Insurance Corporation of India"
	},
	{
		symbol: "HINDUNILVR.NS",
		name: "Hindustan Unilever"
	},
	{
		symbol: "ITC.NS",
		name: "ITC"
	},
	{
		symbol: "LT.NS",
		name: "Larsen & Toubro"
	},
	{
		symbol: "HCLTECH.NS",
		name: "HCL Technologies"
	},
	{
		symbol: "BAJFINANCE.NS",
		name: "Bajaj Finance"
	},
	{
		symbol: "SUNPHARMA.NS",
		name: "Sun Pharmaceutical"
	},
	{
		symbol: "MARUTI.NS",
		name: "Maruti Suzuki"
	},
	{
		symbol: "KOTAKBANK.NS",
		name: "Kotak Mahindra Bank"
	},
	{
		symbol: "M&M.NS",
		name: "Mahindra & Mahindra"
	},
	{
		symbol: "AXISBANK.NS",
		name: "Axis Bank"
	},
	{
		symbol: "NTPC.NS",
		name: "NTPC"
	},
	{
		symbol: "ULTRACEMCO.NS",
		name: "UltraTech Cement"
	},
	{
		symbol: "ONGC.NS",
		name: "Oil & Natural Gas Corporation"
	},
	{
		symbol: "TITAN.NS",
		name: "Titan Company"
	},
	{
		symbol: "ADANIENT.NS",
		name: "Adani Enterprises"
	},
	{
		symbol: "ADANIPORTS.NS",
		name: "Adani Ports & SEZ"
	},
	{
		symbol: "POWERGRID.NS",
		name: "Power Grid Corporation"
	},
	{
		symbol: "WIPRO.NS",
		name: "Wipro"
	},
	{
		symbol: "JSWSTEEL.NS",
		name: "JSW Steel"
	},
	{
		symbol: "BAJAJFINSV.NS",
		name: "Bajaj Finserv"
	},
	{
		symbol: "COALINDIA.NS",
		name: "Coal India"
	},
	{
		symbol: "ASIANPAINT.NS",
		name: "Asian Paints"
	},
	{
		symbol: "NESTLEIND.NS",
		name: "Nestle India"
	},
	{
		symbol: "TATAMOTORS.NS",
		name: "Tata Motors"
	},
	{
		symbol: "BEL.NS",
		name: "Bharat Electronics"
	},
	{
		symbol: "TATASTEEL.NS",
		name: "Tata Steel"
	},
	{
		symbol: "TRENT.NS",
		name: "Trent"
	},
	{
		symbol: "HINDALCO.NS",
		name: "Hindalco Industries"
	},
	{
		symbol: "GRASIM.NS",
		name: "Grasim Industries"
	},
	{
		symbol: "HAL.NS",
		name: "Hindustan Aeronautics"
	},
	{
		symbol: "JIOFIN.NS",
		name: "Jio Financial Services"
	},
	{
		symbol: "DRREDDY.NS",
		name: "Dr. Reddy's Laboratories"
	},
	{
		symbol: "SBILIFE.NS",
		name: "SBI Life Insurance"
	},
	{
		symbol: "EICHERMOT.NS",
		name: "Eicher Motors"
	},
	{
		symbol: "BAJAJ-AUTO.NS",
		name: "Bajaj Auto"
	},
	{
		symbol: "INDUSINDBK.NS",
		name: "IndusInd Bank"
	},
	{
		symbol: "TECHM.NS",
		name: "Tech Mahindra"
	},
	{
		symbol: "HDFCLIFE.NS",
		name: "HDFC Life Insurance"
	},
	{
		symbol: "CIPLA.NS",
		name: "Cipla"
	},
	{
		symbol: "DMART.NS",
		name: "Avenue Supermarts"
	},
	{
		symbol: "VEDL.NS",
		name: "Vedanta"
	},
	{
		symbol: "PIDILITIND.NS",
		name: "Pidilite Industries"
	},
	{
		symbol: "DIVISLAB.NS",
		name: "Divi's Laboratories"
	},
	{
		symbol: "BPCL.NS",
		name: "Bharat Petroleum"
	},
	{
		symbol: "TATACONSUM.NS",
		name: "Tata Consumer Products"
	},
	{
		symbol: "GODREJCP.NS",
		name: "Godrej Consumer Products"
	},
	{
		symbol: "BRITANNIA.NS",
		name: "Britannia Industries"
	},
	{
		symbol: "APOLLOHOSP.NS",
		name: "Apollo Hospitals"
	},
	{
		symbol: "HYUNDAI.NS",
		name: "Hyundai Motor India"
	},
	{
		symbol: "SHREECEM.NS",
		name: "Shree Cement"
	},
	{
		symbol: "AMBUJACEM.NS",
		name: "Ambuja Cements"
	},
	{
		symbol: "DLF.NS",
		name: "DLF"
	},
	{
		symbol: "TVSMOTOR.NS",
		name: "TVS Motor Company"
	},
	{
		symbol: "ZOMATO.NS",
		name: "Eternal (Zomato)"
	},
	{
		symbol: "PNB.NS",
		name: "Punjab National Bank"
	},
	{
		symbol: "BANKBARODA.NS",
		name: "Bank of Baroda"
	},
	{
		symbol: "IOC.NS",
		name: "Indian Oil Corporation"
	},
	{
		symbol: "GAIL.NS",
		name: "GAIL India"
	},
	{
		symbol: "ADANIGREEN.NS",
		name: "Adani Green Energy"
	},
	{
		symbol: "ADANIPOWER.NS",
		name: "Adani Power"
	},
	{
		symbol: "SIEMENS.NS",
		name: "Siemens"
	},
	{
		symbol: "ABB.NS",
		name: "ABB India"
	},
	{
		symbol: "HAVELLS.NS",
		name: "Havells India"
	},
	{
		symbol: "ICICIPRULI.NS",
		name: "ICICI Prudential Life"
	},
	{
		symbol: "ICICIGI.NS",
		name: "ICICI Lombard General Insurance"
	},
	{
		symbol: "CHOLAFIN.NS",
		name: "Cholamandalam Investment"
	},
	{
		symbol: "INDIGO.NS",
		name: "InterGlobe Aviation"
	},
	{
		symbol: "NAUKRI.NS",
		name: "Info Edge India"
	},
	{
		symbol: "PFC.NS",
		name: "Power Finance Corporation"
	},
	{
		symbol: "RECLTD.NS",
		name: "REC"
	},
	{
		symbol: "IRFC.NS",
		name: "Indian Railway Finance"
	},
	{
		symbol: "LODHA.NS",
		name: "Macrotech Developers"
	},
	{
		symbol: "BOSCHLTD.NS",
		name: "Bosch"
	},
	{
		symbol: "TORNTPHARM.NS",
		name: "Torrent Pharmaceuticals"
	},
	{
		symbol: "TORNTPOWER.NS",
		name: "Torrent Power"
	},
	{
		symbol: "CGPOWER.NS",
		name: "CG Power & Industrial Solutions"
	},
	{
		symbol: "ZYDUSLIFE.NS",
		name: "Zydus Lifesciences"
	},
	{
		symbol: "LUPIN.NS",
		name: "Lupin"
	},
	{
		symbol: "MOTHERSON.NS",
		name: "Samvardhana Motherson"
	},
	{
		symbol: "INDHOTEL.NS",
		name: "Indian Hotels"
	},
	{
		symbol: "PIIND.NS",
		name: "PI Industries"
	},
	{
		symbol: "MARICO.NS",
		name: "Marico"
	},
	{
		symbol: "COLPAL.NS",
		name: "Colgate Palmolive India"
	},
	{
		symbol: "DABUR.NS",
		name: "Dabur India"
	},
	{
		symbol: "BERGEPAINT.NS",
		name: "Berger Paints India"
	},
	{
		symbol: "MUTHOOTFIN.NS",
		name: "Muthoot Finance"
	},
	{
		symbol: "BAJAJHLDNG.NS",
		name: "Bajaj Holdings"
	},
	{
		symbol: "SHRIRAMFIN.NS",
		name: "Shriram Finance"
	},
	{
		symbol: "SBICARD.NS",
		name: "SBI Cards & Payment Services"
	},
	{
		symbol: "HDFCAMC.NS",
		name: "HDFC AMC"
	},
	{
		symbol: "IDBI.NS",
		name: "IDBI Bank"
	},
	{
		symbol: "IDFCFIRSTB.NS",
		name: "IDFC First Bank"
	},
	{
		symbol: "FEDERALBNK.NS",
		name: "Federal Bank"
	},
	{
		symbol: "CANBK.NS",
		name: "Canara Bank"
	},
	{
		symbol: "UNIONBANK.NS",
		name: "Union Bank of India"
	},
	{
		symbol: "INDIANB.NS",
		name: "Indian Bank"
	},
	{
		symbol: "AUBANK.NS",
		name: "AU Small Finance Bank"
	},
	{
		symbol: "BANDHANBNK.NS",
		name: "Bandhan Bank"
	},
	{
		symbol: "RBLBANK.NS",
		name: "RBL Bank"
	},
	{
		symbol: "YESBANK.NS",
		name: "Yes Bank"
	},
	{
		symbol: "IOB.NS",
		name: "Indian Overseas Bank"
	},
	{
		symbol: "MAHABANK.NS",
		name: "Bank of Maharashtra"
	},
	{
		symbol: "UCOBANK.NS",
		name: "UCO Bank"
	},
	{
		symbol: "CENTRALBK.NS",
		name: "Central Bank of India"
	},
	{
		symbol: "PSB.NS",
		name: "Punjab & Sind Bank"
	},
	{
		symbol: "JKBANK.NS",
		name: "Jammu & Kashmir Bank"
	},
	{
		symbol: "KARURVYSYA.NS",
		name: "Karur Vysya Bank"
	},
	{
		symbol: "SOUTHBANK.NS",
		name: "South Indian Bank"
	},
	{
		symbol: "CSBBANK.NS",
		name: "CSB Bank"
	},
	{
		symbol: "DCBBANK.NS",
		name: "DCB Bank"
	},
	{
		symbol: "CUB.NS",
		name: "City Union Bank"
	},
	{
		symbol: "EQUITASBNK.NS",
		name: "Equitas Small Finance Bank"
	},
	{
		symbol: "UJJIVANSFB.NS",
		name: "Ujjivan Small Finance Bank"
	},
	{
		symbol: "MANAPPURAM.NS",
		name: "Manappuram Finance"
	},
	{
		symbol: "LICHSGFIN.NS",
		name: "LIC Housing Finance"
	},
	{
		symbol: "PEL.NS",
		name: "Piramal Enterprises"
	},
	{
		symbol: "IIFL.NS",
		name: "IIFL Finance"
	},
	{
		symbol: "POONAWALLA.NS",
		name: "Poonawalla Fincorp"
	},
	{
		symbol: "M&MFIN.NS",
		name: "Mahindra & Mahindra Financial Services"
	},
	{
		symbol: "ABCAPITAL.NS",
		name: "Aditya Birla Capital"
	},
	{
		symbol: "SUNDARMFIN.NS",
		name: "Sundaram Finance"
	},
	{
		symbol: "BAJAJHFL.NS",
		name: "Bajaj Housing Finance"
	},
	{
		symbol: "HUDCO.NS",
		name: "Housing & Urban Development Corp"
	},
	{
		symbol: "IRCTC.NS",
		name: "Indian Railway Catering"
	},
	{
		symbol: "IRCON.NS",
		name: "Ircon International"
	},
	{
		symbol: "RVNL.NS",
		name: "Rail Vikas Nigam"
	},
	{
		symbol: "RAILTEL.NS",
		name: "Railtel Corporation"
	},
	{
		symbol: "CONCOR.NS",
		name: "Container Corporation of India"
	},
	{
		symbol: "GRSE.NS",
		name: "Garden Reach Shipbuilders"
	},
	{
		symbol: "MAZDOCK.NS",
		name: "Mazagon Dock Shipbuilders"
	},
	{
		symbol: "COCHINSHIP.NS",
		name: "Cochin Shipyard"
	},
	{
		symbol: "BDL.NS",
		name: "Bharat Dynamics"
	},
	{
		symbol: "BEML.NS",
		name: "BEML"
	},
	{
		symbol: "HINDPETRO.NS",
		name: "Hindustan Petroleum"
	},
	{
		symbol: "OIL.NS",
		name: "Oil India"
	},
	{
		symbol: "PETRONET.NS",
		name: "Petronet LNG"
	},
	{
		symbol: "GUJGASLTD.NS",
		name: "Gujarat Gas"
	},
	{
		symbol: "IGL.NS",
		name: "Indraprastha Gas"
	},
	{
		symbol: "MGL.NS",
		name: "Mahanagar Gas"
	},
	{
		symbol: "GSPL.NS",
		name: "Gujarat State Petronet"
	},
	{
		symbol: "AEGISLOG.NS",
		name: "Aegis Logistics"
	},
	{
		symbol: "CASTROLIND.NS",
		name: "Castrol India"
	},
	{
		symbol: "MRPL.NS",
		name: "Mangalore Refinery"
	},
	{
		symbol: "CHENNPETRO.NS",
		name: "Chennai Petroleum"
	},
	{
		symbol: "NMDC.NS",
		name: "NMDC"
	},
	{
		symbol: "MOIL.NS",
		name: "MOIL"
	},
	{
		symbol: "SAIL.NS",
		name: "Steel Authority of India"
	},
	{
		symbol: "JINDALSTEL.NS",
		name: "Jindal Steel & Power"
	},
	{
		symbol: "JSWENERGY.NS",
		name: "JSW Energy"
	},
	{
		symbol: "JSL.NS",
		name: "Jindal Stainless"
	},
	{
		symbol: "APLAPOLLO.NS",
		name: "APL Apollo Tubes"
	},
	{
		symbol: "RATNAMANI.NS",
		name: "Ratnamani Metals"
	},
	{
		symbol: "WELCORP.NS",
		name: "Welspun Corp"
	},
	{
		symbol: "JINDALSAW.NS",
		name: "Jindal Saw"
	},
	{
		symbol: "MAHSEAMLES.NS",
		name: "Maharashtra Seamless"
	},
	{
		symbol: "NALCO.NS",
		name: "National Aluminium"
	},
	{
		symbol: "HINDZINC.NS",
		name: "Hindustan Zinc"
	},
	{
		symbol: "HINDCOPPER.NS",
		name: "Hindustan Copper"
	},
	{
		symbol: "GMDCLTD.NS",
		name: "Gujarat Mineral Development"
	},
	{
		symbol: "NATIONALUM.NS",
		name: "National Aluminium Co"
	},
	{
		symbol: "DALBHARAT.NS",
		name: "Dalmia Bharat"
	},
	{
		symbol: "ACC.NS",
		name: "ACC"
	},
	{
		symbol: "RAMCOCEM.NS",
		name: "The Ramco Cements"
	},
	{
		symbol: "JKCEMENT.NS",
		name: "JK Cement"
	},
	{
		symbol: "JKLAKSHMI.NS",
		name: "JK Lakshmi Cement"
	},
	{
		symbol: "HEIDELBERG.NS",
		name: "HeidelbergCement India"
	},
	{
		symbol: "BIRLACORPN.NS",
		name: "Birla Corporation"
	},
	{
		symbol: "NUVOCO.NS",
		name: "Nuvoco Vistas Corporation"
	},
	{
		symbol: "STARCEMENT.NS",
		name: "Star Cement"
	},
	{
		symbol: "INDIACEM.NS",
		name: "India Cements"
	},
	{
		symbol: "PRSMJOHNSN.NS",
		name: "Prism Johnson"
	},
	{
		symbol: "ORIENTCEM.NS",
		name: "Orient Cement"
	},
	{
		symbol: "GODREJPROP.NS",
		name: "Godrej Properties"
	},
	{
		symbol: "OBEROIRLTY.NS",
		name: "Oberoi Realty"
	},
	{
		symbol: "PRESTIGE.NS",
		name: "Prestige Estates"
	},
	{
		symbol: "BRIGADE.NS",
		name: "Brigade Enterprises"
	},
	{
		symbol: "PHOENIXLTD.NS",
		name: "Phoenix Mills"
	},
	{
		symbol: "SOBHA.NS",
		name: "Sobha"
	},
	{
		symbol: "MAHLIFE.NS",
		name: "Mahindra Lifespace"
	},
	{
		symbol: "SUNTECK.NS",
		name: "Sunteck Realty"
	},
	{
		symbol: "ANANTRAJ.NS",
		name: "Anant Raj"
	},
	{
		symbol: "NBCC.NS",
		name: "NBCC India"
	},
	{
		symbol: "IRB.NS",
		name: "IRB Infrastructure"
	},
	{
		symbol: "GMRINFRA.NS",
		name: "GMR Airports Infrastructure"
	},
	{
		symbol: "ASHOKLEY.NS",
		name: "Ashok Leyland"
	},
	{
		symbol: "BHARATFORG.NS",
		name: "Bharat Forge"
	},
	{
		symbol: "BALKRISIND.NS",
		name: "Balkrishna Industries"
	},
	{
		symbol: "MRF.NS",
		name: "MRF"
	},
	{
		symbol: "APOLLOTYRE.NS",
		name: "Apollo Tyres"
	},
	{
		symbol: "CEATLTD.NS",
		name: "CEAT"
	},
	{
		symbol: "JKTYRE.NS",
		name: "JK Tyre & Industries"
	},
	{
		symbol: "ESCORTS.NS",
		name: "Escorts Kubota"
	},
	{
		symbol: "SONACOMS.NS",
		name: "Sona BLW Precision"
	},
	{
		symbol: "EXIDEIND.NS",
		name: "Exide Industries"
	},
	{
		symbol: "AMARAJABAT.NS",
		name: "Amara Raja Energy"
	},
	{
		symbol: "ENDURANCE.NS",
		name: "Endurance Technologies"
	},
	{
		symbol: "TIINDIA.NS",
		name: "Tube Investments"
	},
	{
		symbol: "SCHAEFFLER.NS",
		name: "Schaeffler India"
	},
	{
		symbol: "ZFCVINDIA.NS",
		name: "ZF Commercial Vehicle"
	},
	{
		symbol: "SUNDRMFAST.NS",
		name: "Sundram Fasteners"
	},
	{
		symbol: "MINDAIND.NS",
		name: "UNO Minda"
	},
	{
		symbol: "BHARATGEAR.NS",
		name: "Bharat Gears"
	},
	{
		symbol: "BAJAJELEC.NS",
		name: "Bajaj Electricals"
	},
	{
		symbol: "WHIRLPOOL.NS",
		name: "Whirlpool of India"
	},
	{
		symbol: "VOLTAS.NS",
		name: "Voltas"
	},
	{
		symbol: "BLUESTARCO.NS",
		name: "Blue Star"
	},
	{
		symbol: "CROMPTON.NS",
		name: "Crompton Greaves Consumer"
	},
	{
		symbol: "POLYCAB.NS",
		name: "Polycab India"
	},
	{
		symbol: "KEI.NS",
		name: "KEI Industries"
	},
	{
		symbol: "FINCABLES.NS",
		name: "Finolex Cables"
	},
	{
		symbol: "DIXON.NS",
		name: "Dixon Technologies"
	},
	{
		symbol: "AMBER.NS",
		name: "Amber Enterprises"
	},
	{
		symbol: "HONAUT.NS",
		name: "Honeywell Automation"
	},
	{
		symbol: "CUMMINSIND.NS",
		name: "Cummins India"
	},
	{
		symbol: "THERMAX.NS",
		name: "Thermax"
	},
	{
		symbol: "KIRLOSENG.NS",
		name: "Kirloskar Oil Engines"
	},
	{
		symbol: "BHEL.NS",
		name: "Bharat Heavy Electricals"
	},
	{
		symbol: "SUZLON.NS",
		name: "Suzlon Energy"
	},
	{
		symbol: "INOXWIND.NS",
		name: "Inox Wind"
	},
	{
		symbol: "TDPOWERSYS.NS",
		name: "TD Power Systems"
	},
	{
		symbol: "GEPIL.NS",
		name: "GE Power India"
	},
	{
		symbol: "TRIVENI.NS",
		name: "Triveni Engineering"
	},
	{
		symbol: "ELGIEQUIP.NS",
		name: "Elgi Equipments"
	},
	{
		symbol: "GRINDWELL.NS",
		name: "Grindwell Norton"
	},
	{
		symbol: "CARBORUNIV.NS",
		name: "Carborundum Universal"
	},
	{
		symbol: "TIMKEN.NS",
		name: "Timken India"
	},
	{
		symbol: "SKFINDIA.NS",
		name: "SKF India"
	},
	{
		symbol: "NBVENTURES.NS",
		name: "Nava"
	},
	{
		symbol: "GRAPHITE.NS",
		name: "Graphite India"
	},
	{
		symbol: "HEG.NS",
		name: "HEG"
	},
	{
		symbol: "GUJALKALI.NS",
		name: "Gujarat Alkalies"
	},
	{
		symbol: "DEEPAKNTR.NS",
		name: "Deepak Nitrite"
	},
	{
		symbol: "AARTIIND.NS",
		name: "Aarti Industries"
	},
	{
		symbol: "NAVINFLUOR.NS",
		name: "Navin Fluorine"
	},
	{
		symbol: "SRF.NS",
		name: "SRF"
	},
	{
		symbol: "TATACHEM.NS",
		name: "Tata Chemicals"
	},
	{
		symbol: "GNFC.NS",
		name: "Gujarat Narmada Valley Fert"
	},
	{
		symbol: "GSFC.NS",
		name: "Gujarat State Fertilizers"
	},
	{
		symbol: "COROMANDEL.NS",
		name: "Coromandel International"
	},
	{
		symbol: "CHAMBLFERT.NS",
		name: "Chambal Fertilisers"
	},
	{
		symbol: "RCF.NS",
		name: "Rashtriya Chemicals"
	},
	{
		symbol: "FACT.NS",
		name: "Fertilizers & Chemicals Travancore"
	},
	{
		symbol: "NFL.NS",
		name: "National Fertilizers"
	},
	{
		symbol: "PIDILITIND.NS",
		name: "Pidilite Industries"
	},
	{
		symbol: "BASF.NS",
		name: "BASF India"
	},
	{
		symbol: "ATUL.NS",
		name: "Atul"
	},
	{
		symbol: "VINATIORGA.NS",
		name: "Vinati Organics"
	},
	{
		symbol: "ALKYLAMINE.NS",
		name: "Alkyl Amines Chemicals"
	},
	{
		symbol: "BALAMINES.NS",
		name: "Balaji Amines"
	},
	{
		symbol: "FINEORG.NS",
		name: "Fine Organic"
	},
	{
		symbol: "GALAXYSURF.NS",
		name: "Galaxy Surfactants"
	},
	{
		symbol: "CLEAN.NS",
		name: "Clean Science & Technology"
	},
	{
		symbol: "TATAELXSI.NS",
		name: "Tata Elxsi"
	},
	{
		symbol: "LTTS.NS",
		name: "L&T Technology Services"
	},
	{
		symbol: "LTIM.NS",
		name: "LTIMindtree"
	},
	{
		symbol: "MPHASIS.NS",
		name: "Mphasis"
	},
	{
		symbol: "PERSISTENT.NS",
		name: "Persistent Systems"
	},
	{
		symbol: "COFORGE.NS",
		name: "Coforge"
	},
	{
		symbol: "OFSS.NS",
		name: "Oracle Financial Services"
	},
	{
		symbol: "KPITTECH.NS",
		name: "KPIT Technologies"
	},
	{
		symbol: "TATATECH.NS",
		name: "Tata Technologies"
	},
	{
		symbol: "INTELLECT.NS",
		name: "Intellect Design Arena"
	},
	{
		symbol: "BSOFT.NS",
		name: "Birlasoft"
	},
	{
		symbol: "CYIENT.NS",
		name: "Cyient"
	},
	{
		symbol: "FSL.NS",
		name: "Firstsource Solutions"
	},
	{
		symbol: "ZENSARTECH.NS",
		name: "Zensar Technologies"
	},
	{
		symbol: "SONATSOFTW.NS",
		name: "Sonata Software"
	},
	{
		symbol: "RAMCOSYS.NS",
		name: "Ramco Systems"
	},
	{
		symbol: "NIITLTD.NS",
		name: "NIIT"
	},
	{
		symbol: "ROUTE.NS",
		name: "Route Mobile"
	},
	{
		symbol: "TANLA.NS",
		name: "Tanla Platforms"
	},
	{
		symbol: "HAPPSTMNDS.NS",
		name: "Happiest Minds Technologies"
	},
	{
		symbol: "MAPMYINDIA.NS",
		name: "C.E. Info Systems"
	},
	{
		symbol: "ZAGGLE.NS",
		name: "Zaggle Prepaid"
	},
	{
		symbol: "POLICYBZR.NS",
		name: "PB Fintech"
	},
	{
		symbol: "PAYTM.NS",
		name: "One 97 Communications"
	},
	{
		symbol: "NYKAA.NS",
		name: "FSN E-Commerce (Nykaa)"
	},
	{
		symbol: "DELHIVERY.NS",
		name: "Delhivery"
	},
	{
		symbol: "BLUEDART.NS",
		name: "Blue Dart Express"
	},
	{
		symbol: "TCI.NS",
		name: "Transport Corporation of India"
	},
	{
		symbol: "GATI.NS",
		name: "Gati"
	},
	{
		symbol: "MAHLOG.NS",
		name: "Mahindra Logistics"
	},
	{
		symbol: "VRLLOG.NS",
		name: "VRL Logistics"
	},
	{
		symbol: "ALLCARGO.NS",
		name: "Allcargo Logistics"
	},
	{
		symbol: "GESHIP.NS",
		name: "Great Eastern Shipping"
	},
	{
		symbol: "SCI.NS",
		name: "Shipping Corporation of India"
	},
	{
		symbol: "TCIEXP.NS",
		name: "TCI Express"
	},
	{
		symbol: "JUBLFOOD.NS",
		name: "Jubilant FoodWorks"
	},
	{
		symbol: "DEVYANI.NS",
		name: "Devyani International"
	},
	{
		symbol: "WESTLIFE.NS",
		name: "Westlife Foodworld"
	},
	{
		symbol: "SAPPHIRE.NS",
		name: "Sapphire Foods India"
	},
	{
		symbol: "VBL.NS",
		name: "Varun Beverages"
	},
	{
		symbol: "UBL.NS",
		name: "United Breweries"
	},
	{
		symbol: "RADICO.NS",
		name: "Radico Khaitan"
	},
	{
		symbol: "UNITDSPR.NS",
		name: "United Spirits"
	},
	{
		symbol: "MCDOWELL-N.NS",
		name: "United Spirits"
	},
	{
		symbol: "TASTYBITE.NS",
		name: "Tasty Bite Eatables"
	},
	{
		symbol: "BIKAJI.NS",
		name: "Bikaji Foods"
	},
	{
		symbol: "HATSUN.NS",
		name: "Hatsun Agro Product"
	},
	{
		symbol: "HERITGFOOD.NS",
		name: "Heritage Foods"
	},
	{
		symbol: "PARAGMILK.NS",
		name: "Parag Milk Foods"
	},
	{
		symbol: "KRBL.NS",
		name: "KRBL"
	},
	{
		symbol: "GODREJAGRO.NS",
		name: "Godrej Agrovet"
	},
	{
		symbol: "AVANTIFEED.NS",
		name: "Avanti Feeds"
	},
	{
		symbol: "VENKEYS.NS",
		name: "Venky's India"
	},
	{
		symbol: "EMAMILTD.NS",
		name: "Emami"
	},
	{
		symbol: "JYOTHYLAB.NS",
		name: "Jyothy Labs"
	},
	{
		symbol: "GILLETTE.NS",
		name: "Gillette India"
	},
	{
		symbol: "PGHH.NS",
		name: "Procter & Gamble Hygiene"
	},
	{
		symbol: "BAJAJCON.NS",
		name: "Bajaj Consumer Care"
	},
	{
		symbol: "VBL.NS",
		name: "Varun Beverages"
	},
	{
		symbol: "PAGEIND.NS",
		name: "Page Industries"
	},
	{
		symbol: "RELAXO.NS",
		name: "Relaxo Footwears"
	},
	{
		symbol: "BATAINDIA.NS",
		name: "Bata India"
	},
	{
		symbol: "METROBRAND.NS",
		name: "Metro Brands"
	},
	{
		symbol: "CAMPUS.NS",
		name: "Campus Activewear"
	},
	{
		symbol: "ABFRL.NS",
		name: "Aditya Birla Fashion"
	},
	{
		symbol: "VMART.NS",
		name: "V-Mart Retail"
	},
	{
		symbol: "SHOPERSTOP.NS",
		name: "Shoppers Stop"
	},
	{
		symbol: "TRENT.NS",
		name: "Trent"
	},
	{
		symbol: "ARVIND.NS",
		name: "Arvind"
	},
	{
		symbol: "KPRMILL.NS",
		name: "K.P.R. Mill"
	},
	{
		symbol: "WELSPUNLIV.NS",
		name: "Welspun Living"
	},
	{
		symbol: "TRIDENT.NS",
		name: "Trident"
	},
	{
		symbol: "VARDHACRLC.NS",
		name: "Vardhman Acrylics"
	},
	{
		symbol: "RAYMOND.NS",
		name: "Raymond"
	},
	{
		symbol: "GRASIM.NS",
		name: "Grasim Industries"
	},
	{
		symbol: "ALKEM.NS",
		name: "Alkem Laboratories"
	},
	{
		symbol: "BIOCON.NS",
		name: "Biocon"
	},
	{
		symbol: "AUROPHARMA.NS",
		name: "Aurobindo Pharma"
	},
	{
		symbol: "GLAND.NS",
		name: "Gland Pharma"
	},
	{
		symbol: "GLENMARK.NS",
		name: "Glenmark Pharmaceuticals"
	},
	{
		symbol: "LAURUSLABS.NS",
		name: "Laurus Labs"
	},
	{
		symbol: "MANKIND.NS",
		name: "Mankind Pharma"
	},
	{
		symbol: "ABBOTINDIA.NS",
		name: "Abbott India"
	},
	{
		symbol: "PFIZER.NS",
		name: "Pfizer"
	},
	{
		symbol: "SANOFI.NS",
		name: "Sanofi India"
	},
	{
		symbol: "GSK.NS",
		name: "GlaxoSmithKline Pharma"
	},
	{
		symbol: "IPCALAB.NS",
		name: "Ipca Laboratories"
	},
	{
		symbol: "JBCHEPHARM.NS",
		name: "JB Chemicals"
	},
	{
		symbol: "NATCOPHARM.NS",
		name: "Natco Pharma"
	},
	{
		symbol: "AJANTPHARM.NS",
		name: "Ajanta Pharma"
	},
	{
		symbol: "PPLPHARMA.NS",
		name: "Piramal Pharma"
	},
	{
		symbol: "SUVENPHAR.NS",
		name: "Suven Pharmaceuticals"
	},
	{
		symbol: "ERIS.NS",
		name: "Eris Lifesciences"
	},
	{
		symbol: "FORTIS.NS",
		name: "Fortis Healthcare"
	},
	{
		symbol: "MAXHEALTH.NS",
		name: "Max Healthcare Institute"
	},
	{
		symbol: "NH.NS",
		name: "Narayana Hrudayalaya"
	},
	{
		symbol: "MEDPLUS.NS",
		name: "MedPlus Health Services"
	},
	{
		symbol: "METROPOLIS.NS",
		name: "Metropolis Healthcare"
	},
	{
		symbol: "DRLAL.NS",
		name: "Dr. Lal PathLabs"
	},
	{
		symbol: "THYROCARE.NS",
		name: "Thyrocare Technologies"
	},
	{
		symbol: "VIJAYA.NS",
		name: "Vijaya Diagnostic Centre"
	},
	{
		symbol: "POLYMED.NS",
		name: "Poly Medicure"
	},
	{
		symbol: "KIMS.NS",
		name: "Krishna Institute of Medical"
	},
	{
		symbol: "RAINBOW.NS",
		name: "Rainbow Children's Medicare"
	},
	{
		symbol: "GLAXO.NS",
		name: "GlaxoSmithKline Consumer"
	},
	{
		symbol: "PROCTER.NS",
		name: "Procter & Gamble"
	},
	{
		symbol: "JUBLPHARMA.NS",
		name: "Jubilant Pharmova"
	},
	{
		symbol: "CAPLIPOINT.NS",
		name: "Caplin Point Laboratories"
	},
	{
		symbol: "GRANULES.NS",
		name: "Granules India"
	},
	{
		symbol: "STAR.NS",
		name: "Strides Pharma Science"
	},
	{
		symbol: "FDC.NS",
		name: "FDC"
	},
	{
		symbol: "WOCKPHARMA.NS",
		name: "Wockhardt"
	},
	{
		symbol: "INDOCO.NS",
		name: "Indoco Remedies"
	},
	{
		symbol: "SEQUENT.NS",
		name: "Sequent Scientific"
	},
	{
		symbol: "MARKSANS.NS",
		name: "Marksans Pharma"
	},
	{
		symbol: "ORCHPHARMA.NS",
		name: "Orchid Pharma"
	},
	{
		symbol: "NEULANDLAB.NS",
		name: "Neuland Laboratories"
	},
	{
		symbol: "SUPRIYA.NS",
		name: "Supriya Lifescience"
	},
	{
		symbol: "AETHER.NS",
		name: "Aether Industries"
	},
	{
		symbol: "TATAPOWER.NS",
		name: "Tata Power"
	},
	{
		symbol: "NHPC.NS",
		name: "NHPC"
	},
	{
		symbol: "SJVN.NS",
		name: "SJVN"
	},
	{
		symbol: "CESC.NS",
		name: "CESC"
	},
	{
		symbol: "NLCINDIA.NS",
		name: "NLC India"
	},
	{
		symbol: "RPOWER.NS",
		name: "Reliance Power"
	},
	{
		symbol: "TATACOMM.NS",
		name: "Tata Communications"
	},
	{
		symbol: "IDEA.NS",
		name: "Vodafone Idea"
	},
	{
		symbol: "INDUSTOWER.NS",
		name: "Indus Towers"
	},
	{
		symbol: "STLTECH.NS",
		name: "Sterlite Technologies"
	},
	{
		symbol: "HFCL.NS",
		name: "HFCL"
	},
	{
		symbol: "ITI.NS",
		name: "ITI"
	},
	{
		symbol: "GTPL.NS",
		name: "GTPL Hathway"
	},
	{
		symbol: "HATHWAY.NS",
		name: "Hathway Cable"
	},
	{
		symbol: "DBCORP.NS",
		name: "D.B. Corp"
	},
	{
		symbol: "JAGRAN.NS",
		name: "Jagran Prakashan"
	},
	{
		symbol: "PVRINOX.NS",
		name: "PVR INOX"
	},
	{
		symbol: "SUNTV.NS",
		name: "Sun TV Network"
	},
	{
		symbol: "ZEEL.NS",
		name: "Zee Entertainment"
	},
	{
		symbol: "TIPSINDLTD.NS",
		name: "Tips Industries"
	},
	{
		symbol: "SAREGAMA.NS",
		name: "Saregama India"
	},
	{
		symbol: "NAZARA.NS",
		name: "Nazara Technologies"
	},
	{
		symbol: "ONMOBILE.NS",
		name: "OnMobile Global"
	},
	{
		symbol: "NETWORK18.NS",
		name: "Network18 Media"
	},
	{
		symbol: "TV18BRDCST.NS",
		name: "TV18 Broadcast"
	},
	{
		symbol: "DISHTV.NS",
		name: "Dish TV India"
	},
	{
		symbol: "BALRAMCHIN.NS",
		name: "Balrampur Chini"
	},
	{
		symbol: "DHAMPURSUG.NS",
		name: "Dhampur Sugar"
	},
	{
		symbol: "DALMIASUG.NS",
		name: "Dalmia Bharat Sugar"
	},
	{
		symbol: "EIDPARRY.NS",
		name: "EID Parry"
	},
	{
		symbol: "RENUKA.NS",
		name: "Shree Renuka Sugars"
	},
	{
		symbol: "BAJAJHIND.NS",
		name: "Bajaj Hindusthan Sugar"
	},
	{
		symbol: "CCL.NS",
		name: "CCL Products"
	},
	{
		symbol: "TATACOFFEE.NS",
		name: "Tata Coffee"
	},
	{
		symbol: "MCLEODRUSS.NS",
		name: "McLeod Russel India"
	},
	{
		symbol: "JAYNECOIND.NS",
		name: "Jayaswal Neco Industries"
	},
	{
		symbol: "WELSPUNIND.NS",
		name: "Welspun India"
	},
	{
		symbol: "HIMATSEIDE.NS",
		name: "Himatsingka Seide"
	},
	{
		symbol: "SIYSIL.NS",
		name: "Siyaram Silk Mills"
	},
	{
		symbol: "VTL.NS",
		name: "Vardhman Textiles"
	},
	{
		symbol: "RTNINDIA.NS",
		name: "RattanIndia Enterprises"
	},
	{
		symbol: "JPPOWER.NS",
		name: "Jaiprakash Power Ventures"
	},
	{
		symbol: "JPASSOCIAT.NS",
		name: "Jaiprakash Associates"
	},
	{
		symbol: "GVKPIL.NS",
		name: "GVK Power & Infra"
	},
	{
		symbol: "ADANITRANS.NS",
		name: "Adani Energy Solutions"
	},
	{
		symbol: "ADANITOTAL.NS",
		name: "Adani Total Gas"
	},
	{
		symbol: "ADANIWILMAR.NS",
		name: "Adani Wilmar"
	},
	{
		symbol: "ATGL.NS",
		name: "Adani Total Gas"
	},
	{
		symbol: "FLUOROCHEM.NS",
		name: "Gujarat Fluorochemicals"
	},
	{
		symbol: "INOXINDIA.NS",
		name: "INOX India"
	},
	{
		symbol: "BORORENEW.NS",
		name: "Borosil Renewables"
	},
	{
		symbol: "PRAJIND.NS",
		name: "Praj Industries"
	},
	{
		symbol: "ASTRAL.NS",
		name: "Astral"
	},
	{
		symbol: "SUPREMEIND.NS",
		name: "Supreme Industries"
	},
	{
		symbol: "FINOLEXIND.NS",
		name: "Finolex Industries"
	},
	{
		symbol: "JAINIRRIG.NS",
		name: "Jain Irrigation Systems"
	},
	{
		symbol: "KAJARIACER.NS",
		name: "Kajaria Ceramics"
	},
	{
		symbol: "SOMANYCERA.NS",
		name: "Somany Ceramics"
	},
	{
		symbol: "CERA.NS",
		name: "Cera Sanitaryware"
	},
	{
		symbol: "GREENPLY.NS",
		name: "Greenply Industries"
	},
	{
		symbol: "CENTURYPLY.NS",
		name: "Century Plyboards"
	},
	{
		symbol: "GREENPANEL.NS",
		name: "Greenpanel Industries"
	},
	{
		symbol: "ACI.NS",
		name: "Archean Chemical Industries"
	},
	{
		symbol: "EPL.NS",
		name: "EPL"
	},
	{
		symbol: "POLYPLEX.NS",
		name: "Polyplex Corporation"
	},
	{
		symbol: "COSMOFIRST.NS",
		name: "Cosmo First"
	},
	{
		symbol: "UFLEX.NS",
		name: "UFlex"
	},
	{
		symbol: "JINDWORLD.NS",
		name: "Jindal Worldwide"
	},
	{
		symbol: "TIRUMALCHM.NS",
		name: "Thirumalai Chemicals"
	},
	{
		symbol: "BAYERCROP.NS",
		name: "Bayer Cropscience"
	},
	{
		symbol: "UPL.NS",
		name: "UPL"
	},
	{
		symbol: "PIRAMALENT.NS",
		name: "Piramal Enterprises"
	},
	{
		symbol: "RALLIS.NS",
		name: "Rallis India"
	},
	{
		symbol: "DHANUKA.NS",
		name: "Dhanuka Agritech"
	},
	{
		symbol: "INSECTICID.NS",
		name: "Insecticides India"
	},
	{
		symbol: "SHARDACROP.NS",
		name: "Sharda Cropchem"
	},
	{
		symbol: "SUMICHEM.NS",
		name: "Sumitomo Chemical India"
	},
	{
		symbol: "EIHOTEL.NS",
		name: "EIH"
	},
	{
		symbol: "CHALET.NS",
		name: "Chalet Hotels"
	},
	{
		symbol: "LEMONTREE.NS",
		name: "Lemon Tree Hotels"
	},
	{
		symbol: "MAHINDCIE.NS",
		name: "Mahindra CIE Automotive"
	},
	{
		symbol: "RAJESHEXPO.NS",
		name: "Rajesh Exports"
	},
	{
		symbol: "TITAGARH.NS",
		name: "Titagarh Rail Systems"
	},
	{
		symbol: "TEXRAIL.NS",
		name: "Texmaco Rail"
	},
	{
		symbol: "JWL.NS",
		name: "Jupiter Wagons"
	},
	{
		symbol: "IFCI.NS",
		name: "IFCI"
	},
	{
		symbol: "IIFLSEC.NS",
		name: "IIFL Securities"
	},
	{
		symbol: "MOTILALOFS.NS",
		name: "Motilal Oswal Financial"
	},
	{
		symbol: "ANGELONE.NS",
		name: "Angel One"
	},
	{
		symbol: "5PAISA.NS",
		name: "5Paisa Capital"
	},
	{
		symbol: "CDSL.NS",
		name: "Central Depository Services"
	},
	{
		symbol: "MCX.NS",
		name: "Multi Commodity Exchange"
	},
	{
		symbol: "BSE.NS",
		name: "BSE"
	},
	{
		symbol: "CAMS.NS",
		name: "Computer Age Management Services"
	},
	{
		symbol: "KFINTECH.NS",
		name: "KFin Technologies"
	},
	{
		symbol: "UTIAMC.NS",
		name: "UTI Asset Management"
	},
	{
		symbol: "NIPPONLIFE.NS",
		name: "Nippon Life India Asset"
	},
	{
		symbol: "ABSLAMC.NS",
		name: "Aditya Birla Sun Life AMC"
	},
	{
		symbol: "STARHEALTH.NS",
		name: "Star Health Insurance"
	},
	{
		symbol: "NIACL.NS",
		name: "New India Assurance"
	},
	{
		symbol: "GICRE.NS",
		name: "General Insurance Corp"
	},
	{
		symbol: "MEDANTA.NS",
		name: "Global Health"
	},
	{
		symbol: "HOMEFIRST.NS",
		name: "Home First Finance"
	},
	{
		symbol: "AAVAS.NS",
		name: "Aavas Financiers"
	},
	{
		symbol: "REPCO.NS",
		name: "Repco Home Finance"
	},
	{
		symbol: "CANFINHOME.NS",
		name: "Can Fin Homes"
	},
	{
		symbol: "PNBHOUSING.NS",
		name: "PNB Housing Finance"
	},
	{
		symbol: "GICHSGFIN.NS",
		name: "GIC Housing Finance"
	},
	{
		symbol: "EDELWEISS.NS",
		name: "Edelweiss Financial"
	},
	{
		symbol: "JSWINFRA.NS",
		name: "JSW Infrastructure"
	},
	{
		symbol: "GPIL.NS",
		name: "Godawari Power & Ispat"
	},
	{
		symbol: "JSWHL.NS",
		name: "JSW Holdings"
	},
	{
		symbol: "RHIM.NS",
		name: "RHI Magnesita India"
	},
	{
		symbol: "MAITHAN.NS",
		name: "Maithan Alloys"
	},
	{
		symbol: "JINDALPOLY.NS",
		name: "Jindal Poly Films"
	},
	{
		symbol: "VGUARD.NS",
		name: "V-Guard Industries"
	},
	{
		symbol: "ORIENTELEC.NS",
		name: "Orient Electric"
	},
	{
		symbol: "SYMPHONY.NS",
		name: "Symphony"
	},
	{
		symbol: "TTKPRESTIG.NS",
		name: "TTK Prestige"
	},
	{
		symbol: "STOVEKRAFT.NS",
		name: "Stove Kraft"
	},
	{
		symbol: "HAWKINCOOK.NS",
		name: "Hawkins Cookers"
	},
	{
		symbol: "BUTTERFLY.NS",
		name: "Butterfly Gandhimathi"
	},
	{
		symbol: "RAJRATAN.NS",
		name: "Rajratan Global Wire"
	},
	{
		symbol: "USHAMART.NS",
		name: "Usha Martin"
	},
	{
		symbol: "BANSALWIRE.NS",
		name: "Bansal Wire Industries"
	},
	{
		symbol: "RKFORGE.NS",
		name: "Ramkrishna Forgings"
	},
	{
		symbol: "HAPPYFORGE.NS",
		name: "Happy Forgings"
	},
	{
		symbol: "POWERINDIA.NS",
		name: "Hitachi Energy India"
	},
	{
		symbol: "GMMPFAUDLR.NS",
		name: "GMM Pfaudler"
	},
	{
		symbol: "ENGINERSIN.NS",
		name: "Engineers India"
	},
	{
		symbol: "AIAENG.NS",
		name: "AIA Engineering"
	},
	{
		symbol: "ESABINDIA.NS",
		name: "ESAB India"
	},
	{
		symbol: "GREAVESCOT.NS",
		name: "Greaves Cotton"
	},
	{
		symbol: "ELECON.NS",
		name: "Elecon Engineering"
	},
	{
		symbol: "ISGEC.NS",
		name: "Isgec Heavy Engineering"
	},
	{
		symbol: "KIRLPNU.NS",
		name: "Kirloskar Pneumatic"
	},
	{
		symbol: "KIRLOSBROS.NS",
		name: "Kirloskar Brothers"
	},
	{
		symbol: "WABAG.NS",
		name: "VA Tech Wabag"
	},
	{
		symbol: "ION.NS",
		name: "ION Exchange"
	},
	{
		symbol: "VATECHWAB.NS",
		name: "VA Tech Wabag"
	},
	{
		symbol: "EIMCOELECO.NS",
		name: "Eimco Elecon"
	},
	{
		symbol: "JYOTICNC.NS",
		name: "Jyoti CNC Automation"
	},
	{
		symbol: "MTARTECH.NS",
		name: "MTAR Technologies"
	},
	{
		symbol: "RATEGAIN.NS",
		name: "RateGain Travel"
	},
	{
		symbol: "EASEMYTRIP.NS",
		name: "Easy Trip Planners"
	},
	{
		symbol: "YATRA.NS",
		name: "Yatra Online"
	},
	{
		symbol: "SPICEJET.NS",
		name: "SpiceJet"
	},
	{
		symbol: "JETAIRWAYS.NS",
		name: "Jet Airways"
	},
	{
		symbol: "GLOBE.NS",
		name: "Globe Civil Projects"
	},
	{
		symbol: "HGINFRA.NS",
		name: "H.G. Infra Engineering"
	},
	{
		symbol: "KNRCON.NS",
		name: "KNR Constructions"
	},
	{
		symbol: "PNCINFRA.NS",
		name: "PNC Infratech"
	},
	{
		symbol: "DBL.NS",
		name: "Dilip Buildcon"
	},
	{
		symbol: "JKIL.NS",
		name: "J Kumar Infraprojects"
	},
	{
		symbol: "NCC.NS",
		name: "NCC"
	},
	{
		symbol: "ITDC.NS",
		name: "India Tourism Development"
	},
	{
		symbol: "RITES.NS",
		name: "RITES"
	},
	{
		symbol: "MAHSCOOTER.NS",
		name: "Maharashtra Scooters"
	},
	{
		symbol: "MASTEK.NS",
		name: "Mastek"
	},
	{
		symbol: "QUESS.NS",
		name: "Quess Corp"
	},
	{
		symbol: "TEAMLEASE.NS",
		name: "TeamLease Services"
	},
	{
		symbol: "SIS.NS",
		name: "SIS"
	},
	{
		symbol: "AFFLE.NS",
		name: "Affle India"
	},
	{
		symbol: "INDIAMART.NS",
		name: "IndiaMART InterMESH"
	},
	{
		symbol: "JUSTDIAL.NS",
		name: "Just Dial"
	},
	{
		symbol: "MATRIMONY.NS",
		name: "Matrimony.com"
	},
	{
		symbol: "LATENTVIEW.NS",
		name: "Latent View Analytics"
	},
	{
		symbol: "NEWGEN.NS",
		name: "Newgen Software"
	},
	{
		symbol: "RSYSTEMS.NS",
		name: "R Systems International"
	},
	{
		symbol: "ECLERX.NS",
		name: "eClerx Services"
	},
	{
		symbol: "WTCL.NS",
		name: "WTC Logistics"
	},
	{
		symbol: "GMRP&UI.NS",
		name: "GMR Power & Urban Infra"
	},
	{
		symbol: "KALPATPOWR.NS",
		name: "Kalpataru Projects"
	},
	{
		symbol: "KEC.NS",
		name: "KEC International"
	},
	{
		symbol: "PATELENG.NS",
		name: "Patel Engineering"
	},
	{
		symbol: "AHLUCONT.NS",
		name: "Ahluwalia Contracts"
	},
	{
		symbol: "ITDCEM.NS",
		name: "ITD Cementation"
	},
	{
		symbol: "CAPACITE.NS",
		name: "Capacit'e Infraprojects"
	},
	{
		symbol: "ASHIANA.NS",
		name: "Ashiana Housing"
	},
	{
		symbol: "ARVSMART.NS",
		name: "Arvind SmartSpaces"
	},
	{
		symbol: "PURVA.NS",
		name: "Puravankara"
	},
	{
		symbol: "KOLTEPATIL.NS",
		name: "Kolte-Patil Developers"
	},
	{
		symbol: "MAHEPC.NS",
		name: "Mahindra EPC Irrigation"
	},
	{
		symbol: "EMSLIMITED.NS",
		name: "EMS"
	},
	{
		symbol: "ALLCARGO.NS",
		name: "Allcargo Logistics"
	},
	{
		symbol: "SAFARI.NS",
		name: "Safari Industries"
	},
	{
		symbol: "VIPIND.NS",
		name: "VIP Industries"
	},
	{
		symbol: "ETERNAL.NS",
		name: "Eternal"
	},
	{
		symbol: "SWIGGY.NS",
		name: "Swiggy"
	},
	{
		symbol: "FIRSTCRY.NS",
		name: "Brainbees Solutions (FirstCry)"
	},
	{
		symbol: "OLAELEC.NS",
		name: "Ola Electric Mobility"
	},
	{
		symbol: "NIVABUPA.NS",
		name: "Niva Bupa Health Insurance"
	},
	{
		symbol: "WAAREE.NS",
		name: "Waaree Energies"
	},
	{
		symbol: "PREMIER.NS",
		name: "Premier Energies"
	},
	{
		symbol: "ACME.NS",
		name: "ACME Solar Holdings"
	},
	{
		symbol: "SAGILITY.NS",
		name: "Sagility India"
	},
	{
		symbol: "NTPCGREEN.NS",
		name: "NTPC Green Energy"
	},
	{
		symbol: "ZINKA.NS",
		name: "Zinka Logistics (BlackBuck)"
	},
	{
		symbol: "INVENTURUS.NS",
		name: "Inventurus Knowledge"
	},
	{
		symbol: "VISHAL.NS",
		name: "Vishal Mega Mart"
	},
	{
		symbol: "MOBIKWIK.NS",
		name: "One MobiKwik Systems"
	},
	{
		symbol: "INDOSTAR.NS",
		name: "IndoStar Capital Finance"
	}
];
var seen = /* @__PURE__ */ new Set();
var NSE_500_UNIQUE = NSE_500.filter((s) => {
	if (seen.has(s.symbol)) return false;
	seen.add(s.symbol);
	return true;
});
var INDIA_INDICES = [
	{
		symbol: "^NSEI",
		name: "NIFTY 50"
	},
	{
		symbol: "^BSESN",
		name: "BSE SENSEX"
	},
	{
		symbol: "^NSEBANK",
		name: "NIFTY BANK"
	},
	{
		symbol: "^CNXIT",
		name: "NIFTY IT"
	},
	{
		symbol: "NIFTY_MIDCAP_100.NS",
		name: "NIFTY MIDCAP 100"
	}
];
var TOP_CRYPTO = [
	{
		symbol: "BTC-USD",
		name: "Bitcoin"
	},
	{
		symbol: "ETH-USD",
		name: "Ethereum"
	},
	{
		symbol: "BNB-USD",
		name: "BNB"
	},
	{
		symbol: "SOL-USD",
		name: "Solana"
	},
	{
		symbol: "XRP-USD",
		name: "XRP"
	}
];
var FULL_UNIVERSE = [
	...INDIA_INDICES,
	...TOP_CRYPTO,
	...NSE_500_UNIQUE
];
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var simulatePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e65cefd224bace7eb24022dcc9ec350f18f9469e87d4c99f51e8038bc7455445"));
var scanStock = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ab426c9010e05c56bd5585f8c5f6cd21908b9b0b85df64fcf3408a2c1bdbd134"));
var checkRetestBatch = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4b85a58669f02a2b7ce44f60b1b729cf8b9a073e314ed505095caa3e144da8ea"));
var getQuotesBatch = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("79e8a8372b766b286ec73493b614dfc24464a79b0dfb30608d3b7490ce8b32db"));
var backtestStock = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0e3084ee207d8a13a5cea140a0a3288a8bbea0f5e0615518224337888b21eff1"));
var aggregateBacktest = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7c640e65587d3708c844871c50f1de5f187352f0c91127c7f8b032c548532c68"));
var saveScanResults = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("784d9f6692509a59f870d0fb62c24aa436a2a42f7cc632902ce58b2f0a7662d8"));
var loadScanResults = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("1da4266b0e73f9f240d869675c5f2db16e2633bd61e73c0de06a6f8e1003ce34"));
var savePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c868e702522e6fa59dbcfe18b3d2f57bc9147bb45885d310b9721a9501bf456c"));
var updatePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ba654d26a20b0f7860bd1e3f73a021eb72a8b0446909b9e1679e02d8c7418a4b"));
var deletePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("fdcd15c61ace0e6a5406f6b10d3bf075cff054422162ed3680e957fa67076962"));
var loadPaperTrades = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0e338e5021b9c65ea7dd388aea2de1b80a8306e558799a277d055740ee087667"));
var clearPaperTradeHistory = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("76e2c7333194f51d5aea38142f42deafdca6e388bebe433655c34baa188fb51a"));
var batchUpdatePaperTrades = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("82cf61328754b6e2619ce8b1da6fe3b725b0ff7cb703615dab7871f2a5d69896"));
var CONCURRENCY = 8;
function calcPnl(trade) {
	const price = trade.status === "Closed" ? trade.exitPrice : trade.currentPrice;
	if (price == null) return {
		amount: null,
		pct: null
	};
	const raw = price - trade.entryPrice;
	const adjusted = trade.side === "BUY" ? raw : -raw;
	return {
		amount: adjusted,
		pct: adjusted / trade.entryPrice * 100
	};
}
function PnlText({ value, prefix = "" }) {
	if (value == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: value >= 0 ? "text-profit" : "text-loss",
		children: [
			value >= 0 ? "+" : "",
			prefix,
			value.toFixed(2),
			prefix ? "" : "%"
		]
	});
}
function SignalBadge({ signal }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: signal === "BUY" ? "badge-buy" : "badge-sell",
		children: signal
	});
}
function Index() {
	const scan = useServerFn(scanStock);
	const retestCheck = useServerFn(checkRetestBatch);
	const dbSaveScan = useServerFn(saveScanResults);
	const dbLoadScan = useServerFn(loadScanResults);
	const dbLoadScanRef = (0, import_react.useRef)(dbLoadScan);
	dbLoadScanRef.current = dbLoadScan;
	const [tf, setTf] = (0, import_react.useState)("1d");
	const [filter, setFilter] = (0, import_react.useState)("ALL");
	const [search, setSearch] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)({
		done: 0,
		total: 0
	});
	const [autoRefresh, setAutoRefresh] = (0, import_react.useState)(false);
	const [lastUpdated, setLastUpdated] = (0, import_react.useState)(null);
	const [retestRefreshing, setRetestRefreshing] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("original");
	const [activeSymbols, setActiveSymbols] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const runningRef = (0, import_react.useRef)(false);
	const retestRefreshRef = (0, import_react.useRef)(false);
	const paperRef = (0, import_react.useRef)(null);
	const [loadingTf, setLoadingTf] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoadingTf(true);
		setRows([]);
		setLastUpdated(null);
		dbLoadScanRef.current({ data: { timeframe: tf } }).then((data) => {
			if (cancelled) return;
			if (data?.results?.length > 0) {
				setRows(data.results);
				if (data.updatedAt) setLastUpdated(new Date(data.updatedAt));
			}
		}).catch(() => {}).finally(() => {
			if (!cancelled) setLoadingTf(false);
		});
		return () => {
			cancelled = true;
		};
	}, [tf]);
	const runScan = (0, import_react.useCallback)(async () => {
		if (runningRef.current) return;
		runningRef.current = true;
		setRunning(true);
		const list = FULL_UNIVERSE;
		setProgress({
			done: 0,
			total: list.length
		});
		const queue = [...list];
		const collected = [];
		let done = 0;
		async function worker() {
			while (queue.length > 0) {
				const item = queue.shift();
				if (!item) break;
				try {
					const r = await scan({ data: {
						symbol: item.symbol,
						name: item.name,
						timeframe: tf
					} });
					if (r.original || r.retests && r.retests.length > 0) collected.push(r);
				} catch {} finally {
					done++;
					setProgress({
						done,
						total: list.length
					});
					if (done % 5 === 0 || done === list.length) setRows([...collected]);
				}
			}
		}
		await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
		setRows([...collected]);
		setLastUpdated(/* @__PURE__ */ new Date());
		setRunning(false);
		runningRef.current = false;
		try {
			await dbSaveScan({ data: {
				timeframe: tf,
				results: collected
			} });
		} catch {}
	}, [
		scan,
		tf,
		dbSaveScan
	]);
	const refreshRetests = (0, import_react.useCallback)(async () => {
		if (retestRefreshRef.current || runningRef.current) return;
		retestRefreshRef.current = true;
		setRetestRefreshing(true);
		const candidates = rows.filter((r) => r.original && r.retestLevel != null && r.retestDirection != null);
		if (candidates.length === 0) {
			retestRefreshRef.current = false;
			setRetestRefreshing(false);
			return;
		}
		try {
			const results = await retestCheck({ data: { items: candidates.map((r) => ({
				symbol: r.symbol,
				name: r.name,
				level: r.retestLevel,
				direction: r.retestDirection,
				signalDate: r.original.signalDate,
				signalTime: r.original.signalTime,
				signalPrice: r.original.signalPrice
			})) } });
			setRows((prev) => {
				const updated = [...prev];
				for (const res of results) {
					const idx = updated.findIndex((r) => r.symbol === res.symbol);
					if (idx < 0) continue;
					const row = {
						...updated[idx],
						retests: [...updated[idx].retests]
					};
					if (res.currentPrice != null) row.currentPrice = res.currentPrice;
					if (res.retested) {
						const now = /* @__PURE__ */ new Date();
						const parts = new Intl.DateTimeFormat("en-GB", {
							timeZone: "Asia/Kolkata",
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: false
						}).formatToParts(now);
						const get = (t) => parts.find((p) => p.type === t)?.value || "";
						const dt = `${get("year")}-${get("month")}-${get("day")}`;
						const tm = `${get("hour")}:${get("minute")}:${get("second")}`;
						if (!row.retests.some((r) => r.signalDate === dt && r.signalTime === tm)) row.retests.push({
							signal: res.direction,
							signalDate: dt,
							signalTime: tm,
							signalPrice: res.level
						});
					}
					updated[idx] = row;
				}
				return updated;
			});
			setLastUpdated(/* @__PURE__ */ new Date());
		} catch {}
		retestRefreshRef.current = false;
		setRetestRefreshing(false);
	}, [rows, retestCheck]);
	(0, import_react.useEffect)(() => {
		if (!autoRefresh) return;
		refreshRetests();
		const id = setInterval(refreshRetests, 6e4);
		return () => clearInterval(id);
	}, [autoRefresh, refreshRetests]);
	const { originals, retests, retestBuys, retestSells } = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		const originals = rows.map((r) => {
			if (!r.original) return null;
			if (filter !== "ALL" && r.original.signal !== filter) return null;
			if (q && !`${r.symbol} ${r.name}`.toLowerCase().includes(q)) return null;
			return {
				symbol: r.symbol,
				name: r.name,
				source: "Original",
				signal: r.original.signal,
				signalDate: r.original.signalDate,
				signalTime: r.original.signalTime,
				signalPrice: r.original.signalPrice,
				currentPrice: r.currentPrice,
				changePct: r.currentPrice != null ? (r.currentPrice - r.original.signalPrice) / r.original.signalPrice * 100 : null,
				timeframe: r.timeframe,
				trend: r.trend
			};
		}).filter((x) => x !== null).sort((a, b) => `${b.signalDate} ${b.signalTime}`.localeCompare(`${a.signalDate} ${a.signalTime}`));
		const allRetests = rows.flatMap((r) => (r.retests || []).map((rt) => {
			if (filter !== "ALL" && rt.signal !== filter) return null;
			if (q && !`${r.symbol} ${r.name}`.toLowerCase().includes(q)) return null;
			return {
				symbol: r.symbol,
				name: r.name,
				source: "Retest",
				signal: rt.signal,
				signalDate: rt.signalDate,
				signalTime: rt.signalTime,
				signalPrice: rt.signalPrice,
				currentPrice: r.currentPrice,
				changePct: r.currentPrice != null ? (r.currentPrice - rt.signalPrice) / rt.signalPrice * 100 : null,
				timeframe: "1m",
				trend: r.trend
			};
		})).filter((x) => x !== null).sort((a, b) => `${b.signalDate} ${b.signalTime}`.localeCompare(`${a.signalDate} ${a.signalTime}`));
		const seen = /* @__PURE__ */ new Set();
		const retests = allRetests.filter((r) => {
			if (seen.has(r.symbol)) return false;
			seen.add(r.symbol);
			return true;
		});
		return {
			originals,
			retests,
			retestBuys: retests.filter((r) => r.signal === "BUY").slice(0, 10),
			retestSells: retests.filter((r) => r.signal === "SELL").slice(0, 10)
		};
	}, [
		rows,
		filter,
		search
	]);
	const pct = progress.total ? Math.round(progress.done / progress.total * 100) : 0;
	const buyCount = originals.filter((r) => r.signal === "BUY").length;
	const sellCount = originals.filter((r) => r.signal === "SELL").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		style: { background: "oklch(0.97 0.004 250)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			style: {
				background: "linear-gradient(180deg, oklch(1 0 0), oklch(0.97 0.004 250))",
				borderBottom: "1px solid oklch(0.90 0.01 255)"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-[1440px] page-pad header-pad px-6 py-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg gradient-cyan",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							style: { color: "oklch(1 0 0)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "22,7 13.5,15.5 8.5,10.5 2,17" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "16,7 22,7 22,13" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-bold tracking-tight",
						style: { color: "oklch(0.18 0.03 260)" },
						children: "Signal Scanner Pro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						style: { color: "oklch(0.50 0.03 255)" },
						children: "NSE 500 · Lorentzian Classification · Yahoo Finance"
					})] })]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-[1440px] page-pad px-6 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium",
								style: { color: "oklch(0.50 0.03 255)" },
								children: "Total Signals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-bold mono",
								style: { color: "oklch(0.20 0.03 260)" },
								children: originals.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							style: { borderColor: "oklch(0.50 0.16 150 / 20%)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium text-profit",
								children: "BUY Signals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-bold mono text-profit",
								children: buyCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							style: { borderColor: "oklch(0.55 0.22 25 / 20%)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium text-loss",
								children: "SELL Signals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-bold mono text-loss",
								children: sellCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium",
								style: { color: "oklch(0.50 0.03 255)" },
								children: "Retests"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-bold mono",
								style: { color: "oklch(0.50 0.16 200)" },
								children: retests.length
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card controls-bar mb-5 flex flex-wrap items-center gap-3 px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold",
							style: { color: "oklch(0.48 0.03 255)" },
							children: "Timeframe"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ctrl-select",
							value: tf,
							onChange: (e) => setTf(e.target.value),
							disabled: running,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "15m",
									children: "15 min"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "30m",
									children: "30 min"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "60m",
									children: "1 hour"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1d",
									children: "1 day"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold",
							style: { color: "oklch(0.48 0.03 255)" },
							children: "Show"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ctrl-select",
							value: filter,
							onChange: (e) => setFilter(e.target.value),
							disabled: running,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ALL",
									children: "All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "BUY",
									children: "BUY only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SELL",
									children: "SELL only"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "ctrl-input w-52",
							placeholder: "Search stock, index or crypto…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "live-toggle ml-auto flex items-center gap-2 text-xs font-medium cursor-pointer",
							style: { color: "oklch(0.48 0.03 255)" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: autoRefresh,
									onChange: (e) => setAutoRefresh(e.target.checked),
									className: "accent-[oklch(0.50_0.16_200)]"
								}),
								autoRefresh && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }),
								"Live retest"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "scan-button",
							onClick: runScan,
							disabled: running,
							children: running ? "Scanning…" : "Run Scan"
						})
					]
				}),
				running && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "progress-bar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "progress-bar-fill",
							style: { width: `${pct}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 text-xs mono",
						style: { color: "oklch(0.50 0.03 255)" },
						children: [
							"Processing ",
							progress.done,
							" / ",
							progress.total,
							" symbols (",
							pct,
							"%)"
						]
					})]
				}),
				!running && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-4 text-xs",
					style: { color: "oklch(0.50 0.03 255)" },
					children: [
						retestRefreshing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }), " Updating retests…"] }),
						lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Last updated: ", lastUpdated.toLocaleTimeString()] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto",
							children: [
								"Universe: ",
								FULL_UNIVERSE.length,
								" symbols"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tab-row mb-4",
					role: "tablist",
					children: [
						{
							id: "original",
							label: `Original (${originals.length})`
						},
						{
							id: "top10",
							label: `Top 10 Retest`
						},
						{
							id: "retests",
							label: `All Retests (${retests.length})`
						},
						{
							id: "paper",
							label: "Paper Trade"
						},
						{
							id: "backtest",
							label: "Backtest"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						role: "tab",
						"aria-selected": activeTab === t.id,
						className: `tab-pill ${activeTab === t.id ? "tab-pill-active" : ""}`,
						onClick: () => setActiveTab(t.id),
						children: t.label
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5",
					children: [
						loadingTf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center py-16 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: 32,
								height: 32,
								border: "3px solid oklch(0.90 0.01 255)",
								borderTopColor: "oklch(0.55 0.17 200)",
								borderRadius: "50%",
								animation: "spin 0.8s linear infinite"
							} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm",
								style: { color: "oklch(0.50 0.03 255)" },
								children: [
									"Loading ",
									tf,
									" data…"
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							activeTab === "original" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalTable, {
								title: "Original BUY / SELL Signals",
								subtitle: "Signal candle generated directly by the Lorentzian classifier.",
								rows: originals
							}),
							activeTab === "top10" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Top10Panel, {
								retestBuys,
								retestSells
							}),
							activeTab === "retests" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalTable, {
								title: "All Retest Entries",
								subtitle: "Every bar where price touched the exact Buy/Sell signal price.",
								rows: retests,
								onAddTrade: paperRef.current?.addTrade,
								activeSymbols
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { display: activeTab === "paper" ? "block" : "none" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTradePanel, {
								ref: paperRef,
								onActiveChange: setActiveSymbols
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { display: activeTab === "backtest" ? "block" : "none" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BacktestPanel, { rows })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "mt-6 pb-8 text-center text-xs",
					style: { color: "oklch(0.58 0.02 255)" },
					children: "Source: Pine v5 \"Machine Learning: Lorentzian Classification (Signals Only)\" by jdehorty. MPI 2.0, OHL·C. Yahoo Finance. Times in Asia/Kolkata (IST). Information only — not investment advice."
				})
			]
		})]
	});
}
function SignalTable({ title, subtitle, rows, onAddTrade, activeSymbols }) {
	const colSpan = onAddTrade ? 12 : 11;
	const [f, setF] = (0, import_react.useState)({
		symbol: "",
		name: "",
		signal: "",
		date: "",
		time: "",
		priceMin: "",
		priceMax: "",
		currentMin: "",
		currentMax: "",
		changeMin: "",
		changeMax: "",
		tf: "",
		trend: ""
	});
	const set = (k, v) => setF((p) => ({
		...p,
		[k]: v
	}));
	const hasFilter = Object.values(f).some((v) => v !== "");
	const filtered = (0, import_react.useMemo)(() => {
		if (!hasFilter) return rows;
		return rows.filter((r) => {
			if (f.symbol && !r.symbol.toLowerCase().includes(f.symbol.toLowerCase())) return false;
			if (f.name && !r.name.toLowerCase().includes(f.name.toLowerCase())) return false;
			if (f.signal && r.signal !== f.signal) return false;
			if (f.date && !r.signalDate.includes(f.date)) return false;
			if (f.time && !r.signalTime.includes(f.time)) return false;
			if (f.priceMin && r.signalPrice < Number(f.priceMin)) return false;
			if (f.priceMax && r.signalPrice > Number(f.priceMax)) return false;
			if (f.currentMin && (r.currentPrice == null || r.currentPrice < Number(f.currentMin))) return false;
			if (f.currentMax && (r.currentPrice == null || r.currentPrice > Number(f.currentMax))) return false;
			if (f.changeMin && (r.changePct == null || r.changePct < Number(f.changeMin))) return false;
			if (f.changeMax && (r.changePct == null || r.changePct > Number(f.changeMax))) return false;
			if (f.tf && r.timeframe !== f.tf) return false;
			if (f.trend && r.trend !== f.trend) return false;
			return true;
		});
	}, [
		rows,
		f,
		hasFilter
	]);
	const fInput = "ctrl-input w-full text-xs";
	const fStyle = {
		padding: "4px 6px",
		fontSize: "0.65rem",
		minWidth: 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-title",
				children: [
					title,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "count",
						children: [
							"(",
							filtered.length,
							hasFilter ? ` / ${rows.length}` : "",
							")"
						]
					})
				]
			}), hasFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-outline-sm",
				style: { fontSize: "0.65rem" },
				onClick: () => setF({
					symbol: "",
					name: "",
					signal: "",
					date: "",
					time: "",
					priceMin: "",
					priceMax: "",
					currentMin: "",
					currentMax: "",
					changeMin: "",
					changeMax: "",
					tf: "",
					trend: ""
				}),
				children: "✕ Clear Filters"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 mb-2 text-xs",
			style: { color: "oklch(0.58 0.02 255)" },
			children: subtitle
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg",
			style: { border: "1px solid oklch(0.90 0.01 255)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "trading-table",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "#"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Symbol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Company"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Signal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Time (IST)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Signal Price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Current"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Change %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "TF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Trend"
					}),
					onAddTrade && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-center",
						children: "Paper Trade"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					style: { background: "oklch(0.96 0.004 250)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: fInput,
							style: fStyle,
							placeholder: "Filter…",
							value: f.symbol,
							onChange: (e) => set("symbol", e.target.value)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: fInput,
							style: fStyle,
							placeholder: "Filter…",
							value: f.name,
							onChange: (e) => set("name", e.target.value)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ctrl-select w-full",
							style: {
								...fStyle,
								minWidth: 60
							},
							value: f.signal,
							onChange: (e) => set("signal", e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "BUY",
									children: "BUY"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SELL",
									children: "SELL"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: fInput,
							style: fStyle,
							placeholder: "YYYY-MM-DD",
							value: f.date,
							onChange: (e) => set("date", e.target.value)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: fInput,
							style: fStyle,
							placeholder: "HH:MM",
							value: f.time,
							onChange: (e) => set("time", e.target.value)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: fInput,
								style: {
									...fStyle,
									width: "50%"
								},
								placeholder: "Min",
								value: f.priceMin,
								onChange: (e) => set("priceMin", e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: fInput,
								style: {
									...fStyle,
									width: "50%"
								},
								placeholder: "Max",
								value: f.priceMax,
								onChange: (e) => set("priceMax", e.target.value)
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: fInput,
								style: {
									...fStyle,
									width: "50%"
								},
								placeholder: "Min",
								value: f.currentMin,
								onChange: (e) => set("currentMin", e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: fInput,
								style: {
									...fStyle,
									width: "50%"
								},
								placeholder: "Max",
								value: f.currentMax,
								onChange: (e) => set("currentMax", e.target.value)
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: fInput,
								style: {
									...fStyle,
									width: "50%"
								},
								placeholder: "Min",
								value: f.changeMin,
								onChange: (e) => set("changeMin", e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: fInput,
								style: {
									...fStyle,
									width: "50%"
								},
								placeholder: "Max",
								value: f.changeMax,
								onChange: (e) => set("changeMax", e.target.value)
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ctrl-select w-full",
							style: {
								...fStyle,
								minWidth: 50
							},
							value: f.tf,
							onChange: (e) => set("tf", e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1m",
									children: "1m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "5m",
									children: "5m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "15m",
									children: "15m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "30m",
									children: "30m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "60m",
									children: "60m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1d",
									children: "1d"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ctrl-select w-full",
							style: {
								...fStyle,
								minWidth: 60
							},
							value: f.trend,
							onChange: (e) => set("trend", e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Bullish",
									children: "Bullish"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Bearish",
									children: "Bearish"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Neutral",
									children: "Neutral"
								})
							]
						}) }),
						onAddTrade && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan,
					className: "text-center py-12",
					style: { color: "oklch(0.58 0.02 255)" },
					children: rows.length === 0 ? "Run scan to populate." : "No matching results."
				}) }), filtered.map((r, i) => {
					const isActive = activeSymbols?.has(r.symbol) ?? false;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							style: { color: "oklch(0.58 0.02 255)" },
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono font-medium",
							style: { color: "oklch(0.22 0.03 260)" },
							children: r.symbol.replace(".NS", "")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadge, { signal: r.signal }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							children: r.signalDate
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							children: r.signalTime
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right mono",
							children: r.signalPrice.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right mono",
							children: r.currentPrice != null ? r.currentPrice.toFixed(2) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right mono",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: r.changePct })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							style: { color: "oklch(0.48 0.03 255)" },
							children: r.timeframe
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: { color: r.trend === "Bullish" ? "oklch(0.45 0.15 150)" : r.trend === "Bearish" ? "oklch(0.50 0.18 25)" : "oklch(0.50 0.03 255)" },
							children: r.trend
						}),
						onAddTrade && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onAddTrade(r),
								disabled: r.currentPrice == null || isActive,
								className: isActive ? "btn-outline-sm opacity-40" : "btn-primary-sm",
								children: isActive ? "Active" : "Add"
							})
						})
					] }, `${r.symbol}-${r.source}-${i}`);
				})] })]
			})
		})
	] });
}
function Top10Panel({ retestBuys, retestSells }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-title mb-3",
			children: ["🟢 Top BUY Retests ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "count",
				children: [
					"(",
					retestBuys.length,
					")"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg",
			style: { border: "1px solid oklch(0.90 0.01 255)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "trading-table",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "#"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Symbol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Company"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Signal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Current"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Trend"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [retestBuys.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 7,
					className: "text-center py-8",
					style: { color: "oklch(0.58 0.02 255)" },
					children: "No BUY retests yet."
				}) }), retestBuys.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "mono",
						style: { color: "oklch(0.58 0.02 255)" },
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "mono font-medium",
						style: { color: "oklch(0.22 0.03 260)" },
						children: r.symbol.replace(".NS", "")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right mono",
						children: r.signalPrice.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right mono",
						children: r.currentPrice?.toFixed(2) ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right mono",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: r.changePct })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						style: { color: "oklch(0.45 0.15 150)" },
						children: r.trend
					})
				] }, r.symbol))] })]
			})
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-title mb-3",
			children: ["🔴 Top SELL Retests ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "count",
				children: [
					"(",
					retestSells.length,
					")"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg",
			style: { border: "1px solid oklch(0.90 0.01 255)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "trading-table",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "#"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Symbol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Company"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Signal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Current"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "Trend"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [retestSells.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 7,
					className: "text-center py-8",
					style: { color: "oklch(0.58 0.02 255)" },
					children: "No SELL retests yet."
				}) }), retestSells.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "mono",
						style: { color: "oklch(0.58 0.02 255)" },
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "mono font-medium",
						style: { color: "oklch(0.22 0.03 260)" },
						children: r.symbol.replace(".NS", "")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right mono",
						children: r.signalPrice.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right mono",
						children: r.currentPrice?.toFixed(2) ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right mono",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: r.changePct })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						style: { color: "oklch(0.50 0.18 25)" },
						children: r.trend
					})
				] }, r.symbol))] })]
			})
		})] })]
	});
}
var PaperTradePanel = (0, import_react.forwardRef)(function PaperTradePanel({ onActiveChange }, ref) {
	const fetchQuotes = useServerFn(getQuotesBatch);
	const runSimulate = useServerFn(simulatePaperTrade);
	const dbSave = useServerFn(savePaperTrade);
	const dbUpdate = useServerFn(updatePaperTrade);
	const dbDelete = useServerFn(deletePaperTrade);
	const dbLoad = useServerFn(loadPaperTrades);
	const dbClear = useServerFn(clearPaperTradeHistory);
	const dbBatchUpdate = useServerFn(batchUpdatePaperTrades);
	const dbLoadRef = (0, import_react.useRef)(dbLoad);
	dbLoadRef.current = dbLoad;
	const [trades, setTrades] = (0, import_react.useState)([]);
	const [updating, setUpdating] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const updatingRef = (0, import_react.useRef)(false);
	const openTrades = (0, import_react.useMemo)(() => trades.filter((t) => t.status === "Open"), [trades]);
	const closedTrades = (0, import_react.useMemo)(() => trades.filter((t) => t.status === "Closed"), [trades]);
	(0, import_react.useEffect)(() => {
		dbLoadRef.current({ data: {} }).then((data) => {
			setTrades((Array.isArray(data) ? data : []).map((t) => ({
				...t,
				dayPnl: t.dayPnl || [
					null,
					null,
					null,
					null,
					null
				]
			})));
		}).catch(() => {}).finally(() => setLoaded(true));
	}, []);
	const addTrade = (0, import_react.useCallback)(async (stock) => {
		if (stock.currentPrice == null) return;
		const now = /* @__PURE__ */ new Date();
		const parts = new Intl.DateTimeFormat("en-CA", {
			timeZone: "Asia/Kolkata",
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).format(now);
		const trade = {
			tradeId: `${stock.symbol}-${Date.now()}`,
			symbol: stock.symbol,
			name: stock.name,
			side: stock.signal,
			entryPrice: stock.currentPrice,
			entryDate: parts,
			holdingDays: 5,
			exitPrice: null,
			exitDate: null,
			currentPrice: stock.currentPrice,
			status: "Open",
			dayPnl: [
				null,
				null,
				null,
				null,
				null
			]
		};
		setTrades((prev) => [trade, ...prev]);
		try {
			await dbSave({ data: trade });
		} catch {}
	}, [dbSave]);
	const activeSet = (0, import_react.useMemo)(() => new Set(openTrades.map((t) => t.symbol)), [openTrades]);
	(0, import_react.useEffect)(() => {
		onActiveChange(activeSet);
	}, [activeSet, onActiveChange]);
	(0, import_react.useImperativeHandle)(ref, () => ({ addTrade }), [addTrade]);
	const doCloseTrade = (0, import_react.useCallback)(async (id) => {
		const trade = trades.find((t) => t.tradeId === id);
		if (!trade || trade.status !== "Open") return;
		const updates = {
			exitPrice: trade.currentPrice,
			exitDate: (/* @__PURE__ */ new Date()).toISOString(),
			status: "Closed"
		};
		setTrades((prev) => prev.map((t) => t.tradeId === id ? {
			...t,
			...updates
		} : t));
		try {
			await dbUpdate({ data: {
				tradeId: id,
				updates
			} });
		} catch {}
	}, [trades, dbUpdate]);
	const doRemoveTrade = (0, import_react.useCallback)(async (id) => {
		setTrades((prev) => prev.filter((t) => t.tradeId !== id));
		try {
			await dbDelete({ data: { tradeId: id } });
		} catch {}
	}, [dbDelete]);
	const doClearHistory = (0, import_react.useCallback)(async () => {
		setTrades((prev) => prev.filter((t) => t.status === "Open"));
		try {
			await dbClear({ data: {} });
		} catch {}
	}, [dbClear]);
	const updatePrices = (0, import_react.useCallback)(async () => {
		if (updatingRef.current || openTrades.length === 0) return;
		updatingRef.current = true;
		setUpdating(true);
		try {
			const prices = await fetchQuotes({ data: { symbols: [...new Set(openTrades.map((t) => t.symbol))] } });
			const simResults = /* @__PURE__ */ new Map();
			await Promise.all(openTrades.map(async (t) => {
				try {
					const r = await runSimulate({ data: {
						symbol: t.symbol,
						name: t.name,
						side: t.side,
						signalDate: t.entryDate,
						signalPrice: t.entryPrice
					} });
					simResults.set(t.tradeId, r.pnlPct);
				} catch {}
			}));
			const dbUpdates = [];
			setTrades((prev) => prev.map((t) => {
				if (t.status !== "Open") return t;
				const price = prices[t.symbol];
				const dayPnl = [...simResults.get(t.tradeId) || t.dayPnl || [
					null,
					null,
					null,
					null,
					null
				]];
				if (dayPnl[0] == null && price != null) {
					const raw = (price - t.entryPrice) / t.entryPrice * 100;
					dayPnl[0] = t.side === "BUY" ? raw : -raw;
				}
				if (dayPnl.length >= 5 && dayPnl[4] != null) {
					const exitP = price ?? t.currentPrice;
					const u = {
						...t,
						currentPrice: price ?? t.currentPrice,
						exitPrice: exitP,
						exitDate: (/* @__PURE__ */ new Date()).toISOString(),
						status: "Closed",
						dayPnl
					};
					dbUpdates.push({
						tradeId: t.tradeId,
						currentPrice: exitP,
						status: "Closed",
						exitPrice: exitP,
						exitDate: u.exitDate
					});
					return u;
				}
				if (price != null) dbUpdates.push({
					tradeId: t.tradeId,
					currentPrice: price
				});
				return {
					...t,
					currentPrice: price ?? t.currentPrice,
					dayPnl
				};
			}));
			if (dbUpdates.length > 0) try {
				await dbBatchUpdate({ data: { updates: dbUpdates } });
			} catch {}
		} catch {}
		updatingRef.current = false;
		setUpdating(false);
	}, [
		openTrades,
		fetchQuotes,
		runSimulate,
		dbBatchUpdate
	]);
	(0, import_react.useEffect)(() => {
		if (openTrades.length === 0) return;
		updatePrices();
		const id = setInterval(updatePrices, 6e4);
		return () => clearInterval(id);
	}, [openTrades.length > 0, updatePrices]);
	(0, import_react.useMemo)(() => {
		let sum = 0;
		let n = 0;
		for (const t of openTrades) {
			const { amount } = calcPnl(t);
			if (amount != null) {
				sum += amount;
				n++;
			}
		}
		return {
			sum,
			n
		};
	}, [openTrades]);
	(0, import_react.useMemo)(() => {
		let sum = 0;
		let n = 0;
		for (const t of closedTrades) {
			const { amount } = calcPnl(t);
			if (amount != null) {
				sum += amount;
				n++;
			}
		}
		return {
			sum,
			n
		};
	}, [closedTrades]);
	const dayTotals = (0, import_react.useMemo)(() => {
		const allTrades = [...openTrades, ...closedTrades];
		const sums = [
			0,
			0,
			0,
			0,
			0
		];
		const counts = [
			0,
			0,
			0,
			0,
			0
		];
		for (const t of allTrades) (t.dayPnl || []).forEach((p, i) => {
			if (p != null && Number.isFinite(p)) {
				sums[i] += p;
				counts[i]++;
			}
		});
		return sums.map((s, i) => ({
			total: s,
			avg: counts[i] ? s / counts[i] : null,
			n: counts[i]
		}));
	}, [openTrades, closedTrades]);
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center",
		style: { color: "oklch(0.50 0.03 255)" },
		children: "Loading trades…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs",
				style: { color: "oklch(0.58 0.02 255)" },
				children: [
					"Go to the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "All Retests" }),
					" tab and click ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Add\"" }),
					" on any stock to start a paper trade. Each trade tracks P&L for 5 trading days, then auto-closes. Prices update every 60s."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						children: ["Active Trades ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "count",
							children: [
								"(",
								openTrades.length,
								")"
							]
						})]
					}),
					updating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs",
						style: { color: "oklch(0.50 0.03 255)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }), "Updating…"]
					}),
					openTrades.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: updatePrices,
						disabled: updating,
						className: "btn-outline-sm ml-auto",
						children: "Refresh"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg",
				style: { border: "1px solid oklch(0.90 0.01 255)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "trading-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "Symbol"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "Side"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Entry"
						}),
						[
							1,
							2,
							3,
							4,
							5
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "text-right",
							children: [
								"Day ",
								d,
								" %"
							]
						}, d)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-center",
							children: "Action"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [openTrades.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 10,
						className: "text-center py-8",
						style: { color: "oklch(0.58 0.02 255)" },
						children: "No active trades. Add stocks from the list above."
					}) }), openTrades.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							style: { color: "oklch(0.58 0.02 255)" },
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono font-medium",
							style: { color: "oklch(0.22 0.03 260)" },
							children: t.symbol.replace(".NS", "")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadge, { signal: t.side }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "text-right mono",
							children: ["₹", t.entryPrice.toFixed(2)]
						}),
						(t.dayPnl || [
							null,
							null,
							null,
							null,
							null
						]).map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right mono",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: p })
						}, idx)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge-open",
							children: "Open"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => doCloseTrade(t.tradeId),
								className: "btn-danger-sm",
								children: "Close"
							})
						})
					] }, t.tradeId))] })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-title",
					children: ["Trade History ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "count",
						children: [
							"(",
							closedTrades.length,
							")"
						]
					})]
				}), closedTrades.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: doClearHistory,
					className: "btn-danger-sm ml-auto",
					children: "Clear history"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg",
				style: { border: "1px solid oklch(0.90 0.01 255)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "trading-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "Symbol"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "Side"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Entry"
						}),
						[
							1,
							2,
							3,
							4,
							5
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "text-right",
							children: [
								"Day ",
								d,
								" %"
							]
						}, d)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-center",
							children: "Action"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						closedTrades.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 10,
							className: "text-center py-8",
							style: { color: "oklch(0.58 0.02 255)" },
							children: "No closed trades yet."
						}) }),
						closedTrades.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono",
								style: { color: "oklch(0.58 0.02 255)" },
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono font-medium",
								style: { color: "oklch(0.22 0.03 260)" },
								children: t.symbol.replace(".NS", "")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadge, { signal: t.side }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right mono",
								children: ["₹", t.entryPrice.toFixed(2)]
							}),
							(t.dayPnl || [
								null,
								null,
								null,
								null,
								null
							]).map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right mono",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: p })
							}, idx)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge-closed",
								children: "Closed"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => doRemoveTrade(t.tradeId),
									className: "btn-outline-sm",
									children: "Remove"
								})
							})
						] }, t.tradeId)),
						openTrades.length + closedTrades.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							style: { background: "oklch(0.97 0.004 250)" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									colSpan: 4,
									className: "font-semibold",
									style: { color: "oklch(0.30 0.02 260)" },
									children: [
										"Totals (",
										dayTotals[0]?.n || 0,
										" trades) — avg · cumulative"
									]
								}),
								dayTotals.map((dt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `text-right mono ${dt.avg == null ? "" : dt.avg >= 0 ? "text-profit" : "text-loss"}`,
									children: dt.avg == null ? "—" : `${dt.avg >= 0 ? "+" : ""}${dt.avg.toFixed(2)}% · ${dt.total >= 0 ? "+" : ""}${dt.total.toFixed(2)}%`
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { colSpan: 2 })
							]
						})
					] })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs",
				style: { color: "oklch(0.58 0.02 255)" },
				children: "Paper trades are persisted in MongoDB. P&L % is side-adjusted (BUY: up=profit, SELL: down=profit). Trades auto-close after 5 trading days."
			})
		]
	});
});
var BT_CONCURRENCY = 4;
function BacktestPanel({ rows }) {
	const runStock = useServerFn(backtestStock);
	const runAggregate = useServerFn(aggregateBacktest);
	const loadSaved = () => {
		try {
			const raw = typeof window !== "undefined" ? localStorage.getItem("bt_state") : null;
			if (raw) return JSON.parse(raw);
		} catch {}
		return null;
	};
	const saved = (0, import_react.useRef)(loadSaved());
	const [enabled, setEnabled] = (0, import_react.useState)(saved.current?.enabled ?? false);
	const [dateRangeKey, setDateRangeKey] = (0, import_react.useState)(saved.current?.dateRangeKey ?? "1y");
	const [customStart, setCustomStart] = (0, import_react.useState)(saved.current?.customStart ?? "");
	const [customEnd, setCustomEnd] = (0, import_react.useState)(saved.current?.customEnd ?? "");
	const [btTimeframe, setBtTimeframe] = (0, import_react.useState)(saved.current?.btTimeframe ?? "1d");
	const [result, setResult] = (0, import_react.useState)(saved.current?.result ?? null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)({
		done: 0,
		total: 0,
		phase: ""
	});
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem("bt_state", JSON.stringify({
				enabled,
				dateRangeKey,
				customStart,
				customEnd,
				btTimeframe,
				result
			}));
		} catch {}
	}, [
		enabled,
		dateRangeKey,
		customStart,
		customEnd,
		btTimeframe,
		result
	]);
	const effectiveDateRange = dateRangeKey === "custom" ? {
		start: customStart,
		end: customEnd
	} : dateRangeKey;
	const handleRun = (0, import_react.useCallback)(async () => {
		setRunning(true);
		setResult(null);
		const list = FULL_UNIVERSE;
		setProgress({
			done: 0,
			total: list.length,
			phase: "Scanning stocks…"
		});
		const allEntries = [];
		const queue = [...list];
		let done = 0;
		let errCount = 0;
		async function worker() {
			while (queue.length > 0) {
				const item = queue.shift();
				if (!item) break;
				try {
					const res = await runStock({ data: {
						symbol: item.symbol,
						name: item.name,
						dateRange: effectiveDateRange,
						timeframe: btTimeframe
					} });
					if (res.entries?.length > 0) allEntries.push(...res.entries);
					if (res.error) errCount++;
				} catch {
					errCount++;
				} finally {
					done++;
					if (done % 5 === 0 || done === list.length) setProgress({
						done,
						total: list.length,
						phase: `Scanning… ${done}/${list.length} — ${allEntries.length} entries found`
					});
				}
			}
		}
		await Promise.all(Array.from({ length: BT_CONCURRENCY }, () => worker()));
		if (allEntries.length === 0) {
			setProgress({
				done: list.length,
				total: list.length,
				phase: `Scan complete. 0 retest entries found across ${list.length} stocks (${errCount} errors). Try a longer date range or daily timeframe.`
			});
			setRunning(false);
			return;
		}
		setProgress({
			done: list.length,
			total: list.length,
			phase: `Found ${allEntries.length} entries. Aggregating…`
		});
		try {
			setResult(await runAggregate({ data: {
				allEntries,
				dateRange: effectiveDateRange,
				totalScanned: list.length
			} }));
		} catch (e) {
			setProgress({
				done: 0,
				total: 0,
				phase: `Error: ${e.message}`
			});
		} finally {
			setRunning(false);
		}
	}, [
		effectiveDateRange,
		btTimeframe,
		runStock,
		runAggregate
	]);
	const sortedTrades = (0, import_react.useMemo)(() => {
		if (!result) return [];
		return [...result.trades].sort((a, b) => `${b.entryDate} ${b.entryTime}`.localeCompare(`${a.entryDate} ${a.entryTime}`));
	}, [result]);
	const exportCSV = (0, import_react.useCallback)(() => {
		if (!sortedTrades.length || !result) return;
		const header = "#,Symbol,Dir,Company,Entry Date,Entry Time,Entry ₹,Exit Type,Exit Time,Exit ₹,P&L (₹),P&L (%),Result";
		const rows = sortedTrades.map((t, i) => `${i + 1},${t.symbol.replace(".NS", "")},${t.direction},"${t.name}",${t.entryDate},${t.entryTime},${t.entryPrice.toFixed(2)},${t.exitType},${t.exitTime},${t.exitPrice.toFixed(2)},${t.pnl.toFixed(2)},${t.pnlPct}%,${t.win ? "WIN" : "LOSS"}`);
		const s = result.summary;
		const summaryRows = [
			"",
			"SUMMARY",
			"",
			`Total Trades,${s.totalTrades}`,
			`Wins,${s.wins}`,
			`Losses,${s.losses}`,
			`Win Rate,${s.winRate}%`,
			`Avg Return,${s.avgReturn}%`,
			`Total Return,${s.totalReturn}%`,
			`Profit Factor,${s.profitFactor}`,
			`Max Drawdown,${s.maxDrawdown}%`,
			`Target Exits (+2%),${s.targetExits}`,
			`EOD Exits (2:55 PM),${s.eodExits}`,
			`Avg Holding (min),${s.avgHoldingMinutes}`
		];
		const csv = [
			header,
			...rows,
			...summaryRows
		].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `backtest_target_exit.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}, [sortedTrades, result]);
	const pct = progress.total > 0 ? Math.round(progress.done / progress.total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "section-title",
				children: "Historical Backtest — Signal Retest Strategy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs font-medium cursor-pointer",
				style: { color: "oklch(0.48 0.03 255)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: enabled,
					onChange: (e) => setEnabled(e.target.checked),
					className: "accent-[oklch(0.50_0.16_200)]"
				}), "Backtest Mode"]
			})]
		}),
		!enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-12 text-center text-sm",
			style: { color: "oklch(0.50 0.03 255)" },
			children: "Enable Backtest Mode to run historical analysis."
		}),
		enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 mb-4 text-xs",
				style: { color: "oklch(0.58 0.02 255)" },
				children: [
					"Entry on first retest of signal price. Exit at ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "+2% profit" }),
					" or ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "2:55 PM" }),
					" same day. No overnight positions."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-medium",
						style: { color: "oklch(0.40 0.03 255)" },
						children: ["Date Range", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: dateRangeKey,
							onChange: (e) => setDateRangeKey(e.target.value),
							className: "ml-2 rounded-md px-2 py-1 text-xs",
							style: { border: "1px solid oklch(0.85 0.02 255)" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "6m",
									children: "Last 6 Months"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1y",
									children: "Last 1 Year"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "2y",
									children: "Last 2 Years"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "3y",
									children: "Last 3 Years"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "4y",
									children: "Last 4 Years"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "custom",
									children: "Custom Range"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-medium",
						style: { color: "oklch(0.40 0.03 255)" },
						children: ["Timeframe", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: btTimeframe,
							onChange: (e) => setBtTimeframe(e.target.value),
							className: "ml-2 rounded-md px-2 py-1 text-xs",
							style: { border: "1px solid oklch(0.85 0.02 255)" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "15m",
									children: "15 Min"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "30m",
									children: "30 Min"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "60m",
									children: "1 Hour"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1d",
									children: "1 Day"
								})
							]
						})]
					}),
					dateRangeKey === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-medium",
						style: { color: "oklch(0.40 0.03 255)" },
						children: ["Start ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: customStart,
							onChange: (e) => setCustomStart(e.target.value),
							className: "ml-1 rounded-md px-2 py-1 text-xs",
							style: { border: "1px solid oklch(0.85 0.02 255)" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-medium",
						style: { color: "oklch(0.40 0.03 255)" },
						children: ["End ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: customEnd,
							onChange: (e) => setCustomEnd(e.target.value),
							className: "ml-1 rounded-md px-2 py-1 text-xs",
							style: { border: "1px solid oklch(0.85 0.02 255)" }
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleRun,
						disabled: running,
						className: "rounded-md px-4 py-1.5 text-xs font-bold text-white",
						style: { background: running ? "oklch(0.60 0.05 255)" : "oklch(0.50 0.18 200)" },
						children: running ? "Running…" : "Run Backtest"
					})
				]
			}),
			running && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "animate-spin w-4 h-4 border-2 rounded-full",
						style: {
							borderColor: "oklch(0.50 0.16 200)",
							borderTopColor: "transparent"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs",
						style: { color: "oklch(0.45 0.03 255)" },
						children: progress.phase
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-2 rounded-full overflow-hidden",
					style: { background: "oklch(0.93 0.01 255)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full transition-all",
						style: {
							width: `${pct}%`,
							background: "oklch(0.50 0.16 200)"
						}
					})
				})]
			}),
			!running && !result && progress.phase && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-6 text-center text-xs",
				style: { color: "oklch(0.55 0.03 255)" },
				children: progress.phase
			}),
			!running && result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap gap-4 text-xs",
					style: { color: "oklch(0.50 0.03 255)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Period: ",
							result.dateRangeUsed.start,
							" → ",
							result.dateRangeUsed.end
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Stocks scanned: ", result.totalStocksProcessed] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Stocks with trades: ", result.totalStocksWithSignals] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold mb-2",
								style: { color: "oklch(0.35 0.03 260)" },
								children: "Performance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-x-3 gap-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Total Trades"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono font-semibold text-right",
										style: { color: "oklch(0.25 0.03 260)" },
										children: result.summary.totalTrades
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Win Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right",
										style: { color: result.summary.winRate >= 50 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" },
										children: [result.summary.winRate, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "W / L"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right",
										style: { color: "oklch(0.35 0.03 260)" },
										children: [
											result.summary.wins,
											" / ",
											result.summary.losses
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold mb-2",
								style: { color: "oklch(0.35 0.03 260)" },
								children: "Returns"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-x-3 gap-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Avg Return"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right",
										style: { color: result.summary.avgReturn >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" },
										children: [
											result.summary.avgReturn > 0 ? "+" : "",
											result.summary.avgReturn,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Total Return"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right",
										style: { color: result.summary.totalReturn >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" },
										children: [
											result.summary.totalReturn > 0 ? "+" : "",
											result.summary.totalReturn,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Profit Factor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono font-semibold text-right",
										style: { color: result.summary.profitFactor >= 1 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" },
										children: result.summary.profitFactor === Infinity ? "∞" : result.summary.profitFactor
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold mb-2",
								style: { color: "oklch(0.35 0.03 260)" },
								children: "Risk"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-x-3 gap-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Max Gain"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right text-profit",
										children: [
											result.summary.maxGain > 0 ? "+" : "",
											result.summary.maxGain,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Max Loss"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right text-loss",
										children: [
											result.summary.maxLoss > 0 ? "+" : "",
											result.summary.maxLoss,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Max DD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right text-loss",
										children: [
											result.summary.maxDrawdown > 0 ? "-" : "",
											result.summary.maxDrawdown,
											"%"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold mb-2",
								style: { color: "oklch(0.35 0.03 260)" },
								children: "Exit Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-x-3 gap-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "+2% Target"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono font-semibold text-right text-profit",
										children: result.summary.targetExits
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "2:55 PM EOD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono font-semibold text-right",
										style: { color: "oklch(0.55 0.15 40)" },
										children: result.summary.eodExits
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "oklch(0.50 0.03 255)" },
										children: "Avg Hold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mono font-semibold text-right",
										style: { color: "oklch(0.35 0.03 260)" },
										children: [result.summary.avgHoldingMinutes, " min"]
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						children: ["All Trades ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "count",
							children: [
								"(",
								sortedTrades.length,
								")"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: exportCSV,
						className: "text-xs font-semibold px-3 py-1.5 rounded-md",
						style: {
							background: "oklch(0.45 0.16 150)",
							color: "#fff"
						},
						children: "⬇ Export CSV"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-lg",
					style: { border: "1px solid oklch(0.90 0.01 255)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "trading-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left",
								children: "#"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left",
								children: "Symbol"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-center",
								children: "Dir"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left",
								children: "Company"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left",
								children: "Entry Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left",
								children: "Entry Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right",
								children: "Entry ₹"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-center",
								children: "Exit Type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left",
								children: "Exit Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right",
								children: "Exit ₹"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right",
								children: "P&L ₹"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right",
								children: "P&L %"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-center",
								children: "Result"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sortedTrades.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 13,
							className: "text-center py-8",
							style: { color: "oklch(0.58 0.02 255)" },
							children: "No trades found."
						}) }) : sortedTrades.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono text-xs",
								style: { color: "oklch(0.50 0.03 255)" },
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-semibold",
								style: { color: "oklch(0.30 0.04 260)" },
								children: t.symbol.replace(".NS", "")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 9,
										fontWeight: 700,
										padding: "1px 6px",
										borderRadius: 3,
										background: t.direction === "BUY" ? "oklch(0.92 0.08 150)" : "oklch(0.92 0.08 25)",
										color: t.direction === "BUY" ? "oklch(0.30 0.15 150)" : "oklch(0.40 0.20 25)"
									},
									children: t.direction
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-xs",
								style: { color: "oklch(0.45 0.02 255)" },
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono text-xs",
								children: t.entryDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono text-xs",
								children: t.entryTime
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono text-right",
								children: t.entryPrice.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 9,
										fontWeight: 700,
										padding: "1px 6px",
										borderRadius: 3,
										background: t.exitType === "TARGET" ? "oklch(0.90 0.10 200)" : "oklch(0.92 0.06 60)",
										color: t.exitType === "TARGET" ? "oklch(0.25 0.14 200)" : "oklch(0.40 0.10 60)"
									},
									children: t.exitType === "TARGET" ? "+2%" : "2:55PM"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono text-xs",
								children: t.exitTime
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono text-right",
								children: t.exitPrice.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "mono text-right font-semibold",
								style: { color: t.pnl >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" },
								children: [t.pnl >= 0 ? "+" : "", t.pnl.toFixed(2)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "mono text-right font-semibold",
								style: { color: t.pnlPct >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" },
								children: [
									t.pnlPct >= 0 ? "+" : "",
									t.pnlPct,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 10,
										fontWeight: 700,
										padding: "2px 8px",
										borderRadius: 4,
										background: t.win ? "oklch(0.92 0.08 150)" : "oklch(0.93 0.08 25)",
										color: t.win ? "oklch(0.30 0.15 150)" : "oklch(0.40 0.20 25)"
									},
									children: t.win ? "WIN" : "LOSS"
								})
							})
						] }, `${t.symbol}-${t.entryDate}-${i}`)) })]
					})
				})
			] })
		] })
	] });
}
//#endregion
export { Index as component };
