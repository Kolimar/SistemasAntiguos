import { RepodixitnewPage } from './app.po';

describe('repodixitnew App', () => {
  let page: RepodixitnewPage;

  beforeEach(() => {
    page = new RepodixitnewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
