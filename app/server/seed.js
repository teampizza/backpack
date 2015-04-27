// Seeds for alerts
// We need to make a factory for fake alerts

// Alerts have:
// - a name
// - a source URL
// - a status
// - a description w/ advice link

Factory.define('alert', AlertsCollection, {
  name: Fake.word(),
  url: "http://www." + Fake.word() + Fake.word() + ".com/",
  status: "new",
  description: Fake.paragraph()
});

// The redundant-looking fields are just there to allow the payloads to be
// randomly regenerated every time the function is called.
function seedAlert() {
  return(
    Factory.create('alert',{
      name: Fake.word(),
      url: "http://www." + Fake.word() + Fake.word() + ".com/",
      status: "new",
      description: Fake.paragraph()
    })
      .after(function(doc) {
        return doc;
      })
  );
}

