import * as React from 'react';
import SyntheticEvent = React.MouseEvent;
import * as DropZone from 'react-dropzone';

interface Props {
  readonly className?: string;
  readonly onDrop?: (acceptedFiles: FileList, rejectedFiles: FileList) => void;
  readonly onDropAccepted?: (files: FileList) => void;
  readonly onDropRejected?: (files: FileList) => void;
  readonly accept?: string;
  readonly maxSize?: number;
}

interface State {
}

export default class ImageLoader extends React.Component<Props, State> {
  private dropZone: React.Component<any, any>;

  open() {
    (this.dropZone as any).open();
  }

  render() {
    const {className, accept, maxSize, onDrop, onDropAccepted, onDropRejected} = this.props;

    return (
      <DropZone
        className={className}
        onDrop={onDrop}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        ref={(node) => { this.dropZone = node; }}
        accept={accept}
        maxSize={maxSize}
      />
    );
  }
}
