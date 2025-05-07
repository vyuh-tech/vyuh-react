import { makeRouteQuery, SanityConfig } from '@/utils';
import { getQueryState, SanityInstance } from '@sanity/sdk';
import { LiveContentProvider, RouteBase } from '@vyuh/react-core';
import React from 'react';
import { Observable } from 'rxjs';

export class SanityLiveContentProvider implements LiveContentProvider {
  private readonly sanityInstance: SanityInstance;
  private readonly config: SanityConfig;

  readonly title: string = 'Sanity Live Content Provider';

  constructor(sanityInstance: SanityInstance, config: SanityConfig) {
    this.sanityInstance = sanityInstance;
    this.config = config;
  }

  async init(): Promise<void> {
    return Promise.resolve();
  }

  async dispose(): Promise<void> {
    return Promise.resolve();
  }

  private liveFetch<T>(options: {
    query: string;
    params?: Record<string, any>;
    includeDrafts?: boolean;
  }) {
    const { query, params } = options;

    const isDraftMode =
      options.includeDrafts || this.config.perspective === 'drafts';
    const source = getQueryState<T>(this.sanityInstance, {
      query,
      params,
      perspective: isDraftMode ? 'drafts' : 'published',
    });

    return source.observable;
  }

  fetchById<T>(
    id: string,
    options: {
      includeDrafts?: boolean;
    },
  ): Observable<T | undefined> {
    const query = `*[_id == $id][0]`;
    const params = { id };

    return this.liveFetch({
      query,
      params,
      includeDrafts: options.includeDrafts,
    });
  }

  fetchSingle<T>(
    query: string,
    options: {
      params?: Record<string, any>;
      includeDrafts?: boolean;
    },
  ): Observable<T | undefined> {
    return this.liveFetch({
      query,
      params: options.params,
      includeDrafts: options.includeDrafts,
    });
  }

  fetchMultiple<T>(
    query: string,
    options: {
      params?: Record<string, any>;
      includeDrafts?: boolean;
    },
  ): Observable<T[] | undefined> {
    return this.liveFetch({
      query,
      params: options.params,
      includeDrafts: options.includeDrafts,
    });
  }

  fetchRoute(options: {
    path?: string;
    routeId?: string;
    includeDrafts?: boolean;
  }): Observable<RouteBase | undefined> {
    const { query, params } = makeRouteQuery(options.path, options.routeId);

    return this.liveFetch({
      query,
      params,
      includeDrafts: options.includeDrafts,
    });
  }

  render({ children }: { children: React.ReactNode }): React.ReactNode {
    return <>{children}</>;
  }
}
