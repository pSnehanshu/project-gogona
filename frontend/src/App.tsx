import { Box } from '@chakra-ui/react';
import CreatorApp from './pages/CreatorApp';

const hostname = window.location.host;
const hostSegments = hostname.split('.');
const handle = hostSegments.length === 3 ? hostSegments[0] : null;

function App() {
  return (
    <Box bg="#000">
      <Box maxW={500} minH="100vh" mx="auto" overflowX="hidden" bg="#d3d3d3">
        {handle ? (
          <CreatorApp handle={handle} fullName="Ashish Chanchlani" />
        ) : (
          <h1>Come back later</h1>
        )}
      </Box>
    </Box>
  );
}

export default App;
