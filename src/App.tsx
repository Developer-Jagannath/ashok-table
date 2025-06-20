import  { useState, useEffect } from 'react';
import { Table, Button, Skeleton, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string) => (
        <div className="flex justify-center">
          {loading ? (
            <Skeleton.Image active className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
          ) : (
            <img 
              src={image} 
              alt="product" 
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-md border-2 border-gray-100 hover:border-blue-300 transition-all duration-200"
            />
          )}
        </div>
      ),
    },
    {
      title: 'Product Details',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Product) => (
        <div className="space-y-2">
          <div className="font-semibold text-gray-800 text-xs md:text-sm leading-tight" title={title}>
            {title}
          </div>
          <div className="text-xs text-gray-500 line-clamp-2 hidden md:block" title={record.description}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <div className="flex justify-center">
          <span className="capitalize bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 md:px-3 rounded-full text-xs font-medium shadow-sm">
            {category}
          </span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number | string) => (
        <div className="text-center">
          <span className="font-bold text-sm md:text-lg text-green-600">
            ${Number(price).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating: { rate: number; count: number }) => (
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm md:text-lg">★</span>
            <span className="font-semibold text-gray-800 text-xs md:text-base">{rating.rate}</span>
          </div>
          <span className="text-xs text-gray-500 hidden md:block">({rating.count} reviews)</span>
        </div>
      ),
    },
  ];

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      // Add 2-second delay for skeleton loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch(`https://fakestoreapi.com/products?limit=10&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: Product[] = await response.json();
      
      // Always replace the data instead of appending
      setProducts(data);
      
      setHasMore(data.length > 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleLoadMore = () => {
    fetchProducts(currentPage + 1);
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 10 }).map((_, index) => ({
      key: `skeleton-${index}`,
      image: (
        <div className="flex justify-center">
          <Skeleton.Image active className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
        </div>
      ),
      title: (
        <div className="space-y-2">
          <Skeleton.Input active size="small" className="w-full" />
          <Skeleton.Input active size="small" className="w-3/4 hidden md:block" />
        </div>
      ),
      category: (
        <div className="flex justify-center w-10 md:w-20">
          <Skeleton.Input active size="small" className="w-10 md:w-20" />
        </div>
      ),
      price: (
        <div className="text-center">
          <Skeleton.Input active size="small" className="w-12 md:w-16" />
        </div>
      ),
      rating: (
        <div className="flex flex-col items-center space-y-1">
          <Skeleton.Input active size="small" className="w-10 md:w-12" />
          <Skeleton.Input active size="small" className="w-12 md:w-16 hidden md:block" />
        </div>
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-4 md:p-8 border border-gray-200">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
              Product Catalog
            </h1>
            <p className="text-sm md:text-base text-gray-600">Discover amazing products with detailed information</p>
          </div>
          
          <div className="overflow-hidden rounded-lg md:rounded-xl border border-gray-200 shadow-lg">
            <Table
              columns={columns}
              dataSource={loading ? renderSkeletonRows() as any : products}
              pagination={false}
              loading={false}
              rowKey={(record: any) => record.id || record.key}
              className="mb-4 md:mb-6"
              rowClassName="hover:bg-blue-50 transition-colors duration-200"
              size="small"
              bordered={false}
              scroll={{ x: 800, y: 400 }}
            />
          </div>
          
          {loading && (
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-md w-full max-w-md">
                <div className="text-center mb-4">
                  <div className="text-base md:text-lg font-medium text-gray-700">Loading new products...</div>
                  <div className="text-xs md:text-sm text-gray-500">Please wait while we fetch the data</div>
                </div>
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </div>
          )}
          
          {hasMore && !loading && (
            <div className="flex justify-center mt-6 md:mt-8">
              <Button
                type="primary"
                size="large"
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 md:px-8 py-2 md:py-3 h-auto text-sm md:text-base font-semibold rounded-full"
              >
                Load More Products
              </Button>
            </div>
          )}
          
          {!hasMore && products.length > 0 && (
            <div className="text-center text-gray-500 py-4 md:py-6 bg-gray-50 rounded-lg mt-4 md:mt-6">
              <div className="text-base md:text-lg font-medium">🎉 All products loaded!</div>
              <div className="text-xs md:text-sm">You've reached the end of our product catalog</div>
            </div>
          )}
          
          {products.length > 0 && (
            <div className="text-center text-gray-600 mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-800 text-sm md:text-base">Showing {products.length} products</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
