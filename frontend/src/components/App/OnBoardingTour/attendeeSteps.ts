
import Step from "@/components/App/OnBoardingTour/Step";

const AttendeeStepsContent = [
    {
        title: "on-boarding-tour:title",
        text: "on-boarding-tour:text",
        img: "/img/onBoarding/1-fishbowl-example.png",
    },
    {
        title: "on-boarding-tour:title",
        text: "on-boarding-tour:text",
        img: "/img/onBoarding/1-fishbowl-example.png"
    },
    {
        title: "on-boarding-tour:title",
        text: "on-boarding-tour:text",
        img: "/img/onBoarding/1-fishbowl-example.png"
    },
    {
        title: "on-boarding-tour:title",
        text: "on-boarding-tour:text",
        img: "/img/onBoarding/1-fishbowl-example.png"
    }
];


const getAttendeeSteps = () => {
  return [
    {
      intro: '<StepTooltip title="on-boarding-tour:title" text="on-boarding-tour:text" img="/img/onBoarding/1-fishbowl-example.png">'
    },
    {
      element: '.button-join',
      intro: 'Join conversation'
    },
    {
      element: '#seat-2',
      intro: 'Chairs step',
    },
    {
      element: '.participant-toggle',
      intro: 'Participants step'
    }
  ];
}

export { getAttendeeSteps };
