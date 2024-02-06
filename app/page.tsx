import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
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

const lastPage = 6;

// This is a react server component only
export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const validMessage = await validateActionSignature(previousFrame.postBody);

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  // then, when done, return next frame
  return (
    <div>
      <a href="https://emotionull.art/">Phettaverse</a> Frame{" "}
      {process.env.NODE_ENV === "development" ? (
        <Link href="/debug">Debug</Link>
      ) : null}
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src={
            state.page === 1
              ? "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/1.png"
              : `https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/${state.page}.png`
          }
        />
        {state.page !== 1 ? (
          <FrameButton onClick={dispatch}>←</FrameButton>
        ) : null}
        {state.page < 3 ? (
          <FrameButton onClick={dispatch}>→</FrameButton>
        ) : (
          <FrameButton href="https://emotionull.art/">Learn More</FrameButton>
        )}
      </FrameContainer>
    </div>
  );
}
