/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, fireEvent } from '@testing-library/react';
import { useStooa } from '@/contexts/StooaManager';
import { useModals } from '@/contexts/ModalsContext';
import { useDevices } from '@/contexts/DevicesContext';
import useVideoRecorder from '@/hooks/useVideoRecorder';
import ButtonMoreOptions from '@/components/App/ButtonMoreOptions';
import { useNavigatorType } from '@/hooks/useNavigatorType';

jest.mock('@/contexts/StooaManager');
jest.mock('@/contexts/ModalsContext');
jest.mock('@/contexts/DevicesContext');
jest.mock('@/hooks/useVideoRecorder');
jest.mock('@/hooks/useNavigatorType');
jest.mock('@/contexts/AppContext');

const devices = {
  audioInputDevices: [
    {
      deviceId: 'default',
      label: 'Default - Built-in Microphone'
    }
  ],
  audioOutputDevices: [
    {
      deviceId: 'default',
      label: 'Default - Built-in Output'
    }
  ],
  videoDevices: [
    {
      deviceId: 'default',
      label: 'Default - Built-in iSight'
    }
  ]
};

describe('Unit test of more options button and their options', () => {
  useStooa.mockReturnValue({ isRecording: false, isModerator: true });
  useModals.mockReturnValue({
    setShowStopRecording: () => jest.fn(),
    showStartRecording: false,
    setShowStartRecording: () => jest.fn()
  });
  useVideoRecorder.mockReturnValue({ supportsCaptureHandle: () => true });
  useNavigatorType.mockReturnValue({ deviceType: 'Desktop' });
  useDevices.mockReturnValue({
    devices,
    audioInputDevice: devices.audioInputDevices[0],
    audioOutputDevice: devices.audioOutputDevices[0],
    videoDevice: devices.videoDevices[0],
    selectAudioOutputDevice: () => jest.fn(),
    selectAudioInputDevice: () => jest.fn(),
    selectVideoDevice: () => jest.fn(),
    permissions: {
      audio: true,
      video: true
    }
  });

  it('It renders more options button', () => {
    const { getByTestId } = render(<ButtonMoreOptions />);
    const button = getByTestId('more-options-button');
    expect(button).toBeInTheDocument();
  });

  it('It renders the button when unlabeled without the label', () => {
    const { getByTestId, queryByTestId } = render(<ButtonMoreOptions unlabeled={true} />);
    const button = getByTestId('more-options-button');
    const label = queryByTestId('label');
    expect(button).toBeInTheDocument();
    expect(label).not.toBeInTheDocument();
  });

  it('It renders the button with no recording option the prejoin', () => {
    const { getByTestId, queryByTestId } = render(<ButtonMoreOptions prejoin={true} />);
    const button = getByTestId('more-options-button');
    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const recordingButton = queryByTestId('recording-button');
    expect(recordingButton).not.toBeInTheDocument();
  });

  it('It renders more options with recording option button when moderator', () => {
    useStooa.mockImplementation(() => ({
      isModerator: true
    }));

    const { getByTestId } = render(<ButtonMoreOptions />);
    const button = getByTestId('more-options-button');
    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const recordingButton = getByTestId('recording-button');
    expect(recordingButton).toBeInTheDocument();
  });

  it('It renders the button when not moderator', () => {
    useStooa.mockImplementation(() => ({
      isModerator: false
    }));

    const { getByTestId, queryByTestId } = render(<ButtonMoreOptions />);
    const button = getByTestId('more-options-button');
    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const recordingButton = queryByTestId('recording-button');
    expect(recordingButton).not.toBeInTheDocument();
  });

  it('It renders the button when has devices with devices listed', () => {
    const { getByTestId, getByText } = render(<ButtonMoreOptions />);
    const button = getByTestId('more-options-button');
    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const videoDeviceDom = getByText(/Default - Built-in iSight/);
    const audioInputDeviceDom = getByText(/Default - Built-in Microphone/);
    expect(videoDeviceDom).toBeInTheDocument();
    expect(audioInputDeviceDom).toBeInTheDocument();
  });

  it('It renders the button when has not devices and lists with permissions text', () => {
    useDevices.mockImplementation(() => ({
      permissions: {
        audio: false,
        video: false
      },
      devices
    }));
    const { getByTestId } = render(<ButtonMoreOptions />);
    const button = getByTestId('more-options-button');
    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const videoDeviceDom = getByTestId('no-video-devices');
    const audioInputDeviceDom = getByTestId('no-audio-input-devices');
    expect(videoDeviceDom).toBeInTheDocument();
    expect(audioInputDeviceDom).toBeInTheDocument();
  });
});
