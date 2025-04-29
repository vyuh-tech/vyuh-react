import {
  FeatureDescriptor,
  SystemReadyEventType,
  TypeDescriptor,
  useVyuhStore,
} from '@vyuh/react-core';
import { ContentExtensionDescriptor } from '@vyuh/react-extension-content';
import {
  APIConfiguration,
  APIContentDescriptor,
} from '@vyuh/react-feature-system';
import { Boxes } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

// Separate component for product grid
const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="w-full p-4">
      <h2 className="mb-4 text-2xl font-bold">Products from DummyJSON API</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="mb-1 truncate text-lg font-semibold">
                {product.title}
              </h3>
              <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                {product.description}
              </p>
              <p className="font-bold text-green-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

class DummyJsonApiConfiguration extends APIConfiguration<Product[]> {
  static readonly schemaType = 'misc.apiContent.dummyJson';
  static readonly typeDescriptor = new TypeDescriptor(this.schemaType, this);

  readonly type: 'products' | 'search';
  readonly searchText?: string;
  readonly limit?: number;

  constructor(props?: Partial<DummyJsonApiConfiguration>) {
    super({ schemaType: 'misc.apiContent.dummyJson' });

    this.type = props?.type || 'products';
    this.searchText = props?.searchText;
    this.limit = props?.limit;
  }

  override async invoke() {
    const url = new URL(
      `https://dummyjson.com/${this.type === 'products' ? 'products' : 'products/search'}`,
    );
    if (this.searchText) url.searchParams.set('q', this.searchText);
    if (this.limit) url.searchParams.set('limit', this.limit.toString());

    const res = await fetch(url);
    return await res.json();
  }

  override build(data: any) {
    // Extract products array and limit to top 10
    const products = data.products.slice(0, 10);

    // Clean build method that just passes products to the component
    return <ProductGrid products={products} />;
  }
}

export const misc = new FeatureDescriptor({
  name: 'misc',
  title: 'Miscellaneous',
  description:
    'Miscellaneous feature showing all capabilities of the Vyuh Framework.',
  icon: <Boxes />,
  extensions: [
    new ContentExtensionDescriptor({
      contents: [
        new APIContentDescriptor({
          configurations: [DummyJsonApiConfiguration.typeDescriptor],
        }),
      ],
    }),
  ],
  async init() {
    const { plugins } = useVyuhStore.getState();

    plugins.event.on(SystemReadyEventType, () =>
      console.log('System is ready'),
    );
  },
});
