import HilltopAdUnit from './HilltopAdUnit';

const AdGrid = () => {
  const adUrls = [
    '', // Ad 1
    '', // Ad 2 (Example)
    '', // Ad 3 (Example)
  ];

  return (
    <div className="flex flex-col justify-center mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adUrls.map((url, i) => (
          <HilltopAdUnit key={i} adUrl={url} />
        ))}
      </div>
    </div>
  );
};

export default AdGrid;
