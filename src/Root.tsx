import React from "react";
import {Composition} from "remotion";
import {HowRagWorks, TOTAL} from "./HowRagWorks";
import {RagStory, STORY_TOTAL} from "./RagStory";
import {MidnightDeploy, MD_TOTAL} from "./MidnightDeploy";
import {LastBlade, LB_TOTAL} from "./LastBlade";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HowRagWorks" component={HowRagWorks} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="RagStory" component={RagStory} durationInFrames={STORY_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="MidnightDeploy" component={MidnightDeploy} durationInFrames={MD_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="LastBlade" component={LastBlade} durationInFrames={LB_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
