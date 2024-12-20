import PropTypes from 'prop-types';
// assets
import Loading from '../../../../components/Loading';
import Box from '../../../../components/Box';

export const TotalOrderLineChartCard = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Box className="relative bg-white w-full text-gray-800 overflow-hidden">
          <div className="relative z-10 p-9">
            <div className="mb-3">
              <div>
                <span className="text-3xl font-medium mr-4 mt-7 mb-3">$108</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-[#128C7E]">
                    Total Order
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[-105px] right-[-140px] w-52 h-52 bg-gradient-to-br from-[#19d37c] via-[#0db77d] to-[#13b77d] rounded-full opacity-50 z-0"></div>
          <div className="absolute top-[-155px] right-[-70px] w-52 h-52 bg-gradient-to-br from-[#19d37c] via-[#0db77d] to-[#13b77d] rounded-full opacity-40 z-10"></div>
        </Box>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

