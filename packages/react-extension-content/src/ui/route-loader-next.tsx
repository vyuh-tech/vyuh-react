import { ContentItem, FeatureDescriptor } from '@vyuh/react-core';

/**
 * Props for the RouteLoader component
 */
export interface RouteLoaderNextProps<TContent extends ContentItem> {
  /**
   * The URL to fetch the route for
   */
  url?: string;

  features: () => FeatureDescriptor[] | Promise<FeatureDescriptor[]>;

  /**
   * Custom render function for the content
   * If not provided, uses the content plugin's render method
   */
  renderContent?: (
    content: TContent,
  ) => React.ReactNode;
  /**
   * Data object for conent
   */
  data: TContent;
  /**
   * The route ID to fetch the route for
   */
  routeId?: string;

  /**
   * Whether to allow refreshing the route
   */
  allowRefresh?: boolean;

  /**
   * Whether to use live updates (observable-based) instead of one-time loading
   */
  live?: boolean;
}

/**
 * A component that loads and renders a route from a URL or route ID
 */
export async function  RouteLoaderNext({
  url,
  data,
  features,
  renderContent,
  routeId,
  allowRefresh = true,
  live = false,
}: RouteLoaderNextProps<ContentItem>) {
  const returnFeature = await features();
  console.log(returnFeature);
  console.log('take'+ data);
  return <div>{renderContent(data)}</div>;
}
