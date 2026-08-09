import { ActivatedRoute } from '@angular/router';
import { getRouteParams } from './filters';

const makeRoute = (queryParams: Record<string, string>): ActivatedRoute =>
  ({
    snapshot: {
      queryParams,
    },
  }) as unknown as ActivatedRoute;

describe('getRouteParams', () => {
  it('returns empty sort and categories when there are no query params', () => {
    const route = makeRoute({});

    expect(getRouteParams(route)).toEqual({ sort: [], categories: [] });
  });

  it('adds a "Novidades" sort filter when new=true', () => {
    const route = makeRoute({ new: 'true' });

    expect(getRouteParams(route)).toEqual({
      sort: [{ name: 'Novidades', type: 'newest' }],
      categories: [],
    });
  });

  it('adds a sale sort filter when sale=true', () => {
    const route = makeRoute({ sale: 'true' });

    expect(getRouteParams(route)).toEqual({
      sort: [{ name: '', type: 'sale' }],
      categories: [],
    });
  });

  it('adds both sort filters when new=true and sale=true', () => {
    const route = makeRoute({ new: 'true', sale: 'true' });

    expect(getRouteParams(route)).toEqual({
      sort: [
        { name: 'Novidades', type: 'newest' },
        { name: '', type: 'sale' },
      ],
      categories: [],
    });
  });

  it('trims and lowercases the param before validating, tolerating whitespace/case', () => {
    const route = makeRoute({ new: '  TRUE  ' });

    expect(getRouteParams(route)).toEqual({
      sort: [{ name: 'Novidades', type: 'newest' }],
      categories: [],
    });
  });

  it('still adds the sort filter when new=false, since only the format is validated', () => {
    // NOTE: isValidQueryParams only checks that the value is the literal string
    // 'true' or 'false' - it does not branch on which one it is. So `?new=false`
    // produces the same "Novidades" sort filter as `?new=true`. This looks like
    // a latent app bug, documented here rather than fixed.
    const route = makeRoute({ new: 'false' });

    expect(getRouteParams(route)).toEqual({
      sort: [{ name: 'Novidades', type: 'newest' }],
      categories: [],
    });
  });

  it('ignores an invalid (non-boolean-like) new param', () => {
    const route = makeRoute({ new: 'yes' });

    expect(getRouteParams(route)).toEqual({ sort: [], categories: [] });
  });

  it('ignores an empty string new param', () => {
    const route = makeRoute({ new: '' });

    expect(getRouteParams(route)).toEqual({ sort: [], categories: [] });
  });

  it('adds a category filter with the given slug when category is present', () => {
    const route = makeRoute({ category: 'camisas' });

    const result = getRouteParams(route);

    expect(result.categories).toEqual([
      { checked: true, count: 0, img: '', name: '', slug: 'camisas' },
    ]);
    expect(result.sort).toEqual([]);
  });

  it('combines sort and category filters when both are present', () => {
    const route = makeRoute({ new: 'true', category: 'camisas' });

    expect(getRouteParams(route)).toEqual({
      sort: [{ name: 'Novidades', type: 'newest' }],
      categories: [{ checked: true, count: 0, img: '', name: '', slug: 'camisas' }],
    });
  });
});
