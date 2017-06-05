/* eslint-env node */
module.exports = {
  name: 'ember-cli-simple-grid',
  description: 'Install ember-cli-simple-grid',

  afterInstall() {
    return this.addPackageToProject('ember-cli-csp-style');
  },

  normalizeEntityName: function(entityName) {
    return entityName;
  },

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
