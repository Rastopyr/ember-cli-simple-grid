# ember-cli-simple-grid

```hbs
{{#simple-grid as | grid |}}
  {{#each listOfItems as | item |}}
    {{#grid.item}}
      Some body of element
    {{/grid.item}}
  {{/each}}
{{/simple-grid}}
```

## How to install

## Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-simple-grid`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
