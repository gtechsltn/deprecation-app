import { visit, waitFor, settled } from "@ember/test-helpers";
import { percySnapshot } from "ember-percy";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";
import lolex from 'lolex';

module("Acceptance | visual regression", function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.clock = lolex.install();
  });

  hooks.afterEach(function() {
    this.clock.uninstall();
  });

  let pagesToLookup = {
    "ember-1.x": "/v1.x",
    "ember-3.x": "/v3.x",
    "ember-data-2.x": "/ember-data/v2.x",
    "ember-cli-2.x": "/ember-cli/v2.x"
  };

  Object.keys(pagesToLookup).map(page => {
    test(`visiting ${page}`, async function(assert) {
      await visit(pagesToLookup[page]);
      await waitFor('[data-test-toc-list-item]', { timeout: 2000 });

      await settled();

      this.clock.tick(3000);


      await percySnapshot(page);
      assert.expect(0);
    });
  });

  test('visit home page', async function(assert) {
    await visit('/');
    await percySnapshot('home-page');
    assert.expect(0);
  });

  test('visit ember-2.x', async function(assert) {
    await visit('/v2.x');
    await settled();
    this.clock.tick(3000);

    await percySnapshot('ember-2.x');
    assert.expect(0);
  })
});
