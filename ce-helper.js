export function upgradeProperty(who, prop) {
	if (who.hasOwnProperty(prop)) {
		let value = who[prop];
		delete who[prop];
		who[prop] = value;
	}
}

const helperParser = new DOMParser();

/**
 * Finds and fetches template.html file in the same directory as customElement's
 * main script. Then returns text content of that file.
 * @param your_import_meta eg. If FileRow custom element wants to get template.html in
 * the same folder as its script, then it must provide its own import.meta
 * so that we, common/boilerplate code, can know the path to that file.
 * @returns Text content of "template.html" (with all html tags and everything.)
 */
function getTemplateString(your_import_meta) {
	return fetch((new URL("./template.html", your_import_meta.url)).pathname).then(
		response => response.text()
	)
}

function getStylingPath(your_import_meta) {
	return (new URL("./style.css", your_import_meta.url)).pathname;
}


function getCssString(your_import_meta) {
	return fetch(getStylingPath(your_import_meta)).then(rsp => rsp.text());
}

function adjustForRelativePath(templateElement, your_import_meta){
	const sources = templateElement.content.querySelectorAll("img[src]");
	for(const source of sources){
		const src = source.getAttribute("src");
		const wantToModify = src.startsWith("./");
		if(!wantToModify) continue;

		const absoluteified = (new URL(src, your_import_meta.url)).pathname;

		source.setAttribute("src", absoluteified);
	}
}

/**
 * You are a Custom Element. To be more precise, you are the main script for
 * a custom element. What you want is to grab the `template.html` in the same
 * folder as you, and then using it, add a shadowRoot to your element definition.
 * 
 * This, provides you that template element as HTMLTemplateElement.
 * @param your_import_meta Just type `import.meta`. I need this to know *your* location.
 * Only then I can get the `template.html` in the same folder as you.
 * @returns 
 */
export async function getTemplateElement(your_import_meta) {
	const textTemplate = await getTemplateString(your_import_meta);

	let HTMLTemplate = helperParser.parseFromString(textTemplate, "text/html")
		.querySelector("template");

	adjustForRelativePath(HTMLTemplate, your_import_meta)


		/**
         * https://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript
		 * The code below finally fixed FoUC!
		 * Previously I was creating <link src...>
		 * But that was somehow causing the style.css to
		 * be re-fetched every time an element was created!
		 * Curiously, template.html files who were fetch()ed
		 * only loaded once in the beginning and browser
		 * used its cache for every next use.
		 * That inspired me to fetch css files as well.
		 * I am glad that now style.css files load once in the
		 * beginning and then reused, not re-fetched.
		 * Who would've thought that using JS fetch() would be
		 * better than using <link src=...>?
		 * I wouldn't! Because the former is manual,
		 * latter is done by browser. If anything is going to be
		 * efficient and fast, it should've been <link ..>
		 * Alas. Now I can finally put this thing in the past.
		 */
	const stl = document.createElement("style");
	stl.innerHTML = await getCssString(your_import_meta);
	HTMLTemplate.content.prepend(stl);

	return HTMLTemplate;
}
