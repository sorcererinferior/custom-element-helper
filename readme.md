> My opinionated approach to custom elements.
> 
> Check out `example-project` folder if you want a quick overview.

# Not a framework, just a helper

Web Components are already good enough for me.

I get scared when I see React or Angular stuff.

Learning materials:

- https://developer.mozilla.org/en-US/docs/Web/Web_Components

- https://web.dev/custom-elements-v1/

- https://web.dev/custom-elements-best-practices/

**Note:** this is not a guide on how to write custom elements. I am just leaving this for my personal future use. Maybe later on, I can add nicer and more comprehensive explanation. If you are a beginner, I recommend links above, starting with Mozilla's. For experienced developers, you either will find this useful (oh I'm so glad) or you will say bad words (well, 💩).

# then, what do you *add* to custom elements?

Custom Elements are good, until you start doing this: (one very long file containing everything)

```javascript
const templateString = `
<style>
 /* some css here ...*/
</style>

<!-- some shadow dom html here ...-->
`;

class MyElement extends HTMLElement {
    ...
}
```

*This doesn't feel right!*

Why in the year of our lord 2022 we would not have separate files for *just html* (1), *just css* (2) and *just js* (3)?

# I prefer to...

...have this folder structure:

```
my-web-app/
│
├─ custom-elements/
│  │
│  ├─ my-custom-counter/
│  │  ├─ main.js
│  │  ├─ style.css
│  │  ├─ template.html
│  │
│  ├─ my-custom-paragraph/
│  │  ├─ main.js
│  │  ├─ style.css
│  │  ├─ template.html
│  │
│  ├─ custom-element-helper.js

```

This way, my CSS file will be recognized as CSS by VS Code. Same for HTML.

I will get proper formatting, syntax checking, and intellisense.
Each file will be shorter, too.

> The task of *custom-element-helper.js* is to provide template html and css for your *main.js*.

For each element, the custom class will be defined in `main.js`.

We also export an `upgradeProperty(who, property)` function stolen from https://web.dev/custom-elements-best-practices/#make-properties-lazy

# Ok, show me an example or a boilerplate!

Check out the `example-project` folder in this repo.