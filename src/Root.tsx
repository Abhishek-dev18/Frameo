import React from "react";
import {Composition, Still} from "remotion";
import {HowRagWorks, TOTAL} from "./HowRagWorks";
import {RagStory, STORY_TOTAL} from "./RagStory";
import {MidnightDeploy, MD_TOTAL} from "./MidnightDeploy";
import {LastBlade, LB_TOTAL} from "./LastBlade";
import {PixelScriptPromo, PROMO_TOTAL} from "./Promo";
import {withWatermark} from "./Watermark";
import {DESIGNS} from "./designs/DebugDiaries";

// Episode styles get the Free-plan watermark when rendered with {"watermark": true}.
const HowRagWorksW = withWatermark(HowRagWorks);
const RagStoryW = withWatermark(RagStory);
const MidnightDeployW = withWatermark(MidnightDeploy);
const LastBladeW = withWatermark(LastBlade);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HowRagWorks" component={HowRagWorksW} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="RagStory" component={RagStoryW} durationInFrames={STORY_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="MidnightDeploy" component={MidnightDeployW} durationInFrames={MD_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="LastBlade" component={LastBladeW} durationInFrames={LB_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="PixelScriptPromo" component={PixelScriptPromo} durationInFrames={PROMO_TOTAL} fps={30} width={1920} height={1080} />
    {/* Debug Diaries channel design options (stills) */}
    {Object.entries(DESIGNS).flatMap(([name, C]) =>
      (["hook", "explain", "end"] as const).map((beat) => <Still key={`${name}-${beat}`} id={`DD-${name}-${beat}`} component={() => <C beat={beat} />} width={1080} height={1920} />),
    )}
  </>
);
