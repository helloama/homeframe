import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  getPreviousFrame,
  useFramesReducer,
  validateActionSignature,
} from "frames.js/next/server";
import Link from "next/link";

type State = {
  page: number;
};

const initialState = { page: 1 };

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;
  return {
    page:
      state.page === 1 && buttonIndex === 1
        ? 2
        : buttonIndex === 1
        ? state.page - 1
        : buttonIndex === 2
        ? state.page + 1
        : 1,
  };
};

const lastPage = 6; // Assuming you have 6 pages of information

// This is a react server component only
export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  // const validMessage = await validateActionSignature(previousFrame.postBody);

  // console.log(validMessage);

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  const pageContent = (page: number) => {
    switch (page) {
      case 1:
        return (
          <>
            <FrameImage src="https://phettaverse.mypinata.cloud/ipfs/QmYW6k3JMb8uSwY34TJRRkdK8j8ZgBtKxX9zcNGD42Pakf/1.png" />
            <p>Embark on a journey of creativity with Phettaverse Character Commissions.</p>
          </>
        );
      case 2:
        return (
          <>
            <FrameImage src="https://phettaverse.mypinata.cloud/ipfs/QmYW6k3JMb8uSwY34TJRRkdK8j8ZgBtKxX9zcNGD42Pakf/3.png" />
            <p>Discovery: Share your vision through our intuitive form.</p>
          </>
        );
      // Add similar case blocks for pages 3 to 5
      case 6:
        return (
          <>
            <FrameImage src="https://phettaverse.mypinata.cloud/ipfs/QmYW6k3JMb8uSwY34TJRRkdK8j8ZgBtKxX9zcNGD42Pakf/2.png" />
            <p>Full Rights: The Sovereign Tier - Turn every pixel and pose into profit.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <a href="https://emotionull.art/commissions/">Emotionull & The Phettaverse</a> homeframe{" "}
      {process.env.NODE_ENV === "development" ? (
        <Link href="/debug">Debug</Link>
      ) : null}
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        {pageContent(state.page)}
        {state.page !== 1 ? (
          <FrameButton onClick={() => dispatch({ type: 'navigate', postBody: { untrustedData: { buttonIndex: 1 } } })}>←</FrameButton>
        ) : null}
        {state.page < lastPage ? (
          <FrameButton onClick={() => dispatch({ type: 'navigate', postBody: { untrustedData: { buttonIndex: 2 } } })}>→</FrameButton>
        ) : (
          <FrameButton href="https://emotionull.art/commissions/">Commission Me!</FrameButton>
        )}
      </FrameContainer>
    </div>
  );
}
