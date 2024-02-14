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

const lastPage = 6; // Assuming 6 pages for the extended commission information

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;
  switch (buttonIndex) {
    case 1:
      return { page: state.page > 1 ? state.page - 1 : lastPage }; // Loop back to last page if on the first page
    case 2:
      return { page: state.page < lastPage ? state.page + 1 : 1 }; // Loop to first page if on the last page
    default:
      return state; // No action taken
  }
};

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

  // Define content for each page dynamically, could be imported from a separate file or API
  const pageContent = [
    { src: "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/1.png", description: "Character Commissions Introduction" },
    { src: "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/2.png", description: "Discovery Phase" },
    { src: "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/3.png", description: "Conceptualization Phase" },
    { src: "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/3.png", description: "Creation Phase" },
    { src: "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/3.png", description: "Finalization Phase" },
    { src: "https://phettaverse.mypinata.cloud/ipfs/QmcYkXSMoa9rViP4enFtVYNeT2GKyUFPFBRNvJBTtNUMvU/3.png", description: "Commission Tiers" },
  ];

  // Render dynamic content based on the current page
  const currentPageContent = pageContent[state.page - 1];

  return (
    <div>
      <a href="https://emotionull.art/">Phettaverse</a> Frame{" "}
      {process.env.NODE_ENV === "development" ? <Link href="/debug">Debug</Link> : null}
      <FrameContainer postUrl="/frames" state={state} previousFrame={previousFrame}>
        <FrameImage src={currentPageContent.src} />
        <p>{currentPageContent.description}</p>
        <FrameButton onClick={dispatch} data={{ buttonIndex: 1 }}>← Previous</FrameButton>
        <FrameButton onClick={dispatch} data={{ buttonIndex: 2 }}>Next →</FrameButton>
        {state.page === lastPage && (
          <FrameButton href="https://emotionull.art/commissions/">Learn More</FrameButton>
        )}
      </FrameContainer>
    </div>
  );
}
