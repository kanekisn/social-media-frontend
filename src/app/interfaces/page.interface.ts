export interface Page<T> {
  _embedded: {
    [key: string]: T[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _links: {
    self: { href: string };
    next?: { href: string };
    prev?: { href: string };
  };
}
