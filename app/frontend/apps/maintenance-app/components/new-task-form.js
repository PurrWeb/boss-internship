import React from 'react';
import classnames from 'classnames';
import uuid from 'uuid/v1';

import Select from 'react-select';
import { Form, Control, Errors, reset } from 'react-redux-form';
import ImageForm from './image-form'

export default class NewTaskForm extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    let uploadedImagesArray = _.uniq(prevState.uploadedImages.map((uploadedImage) => { return uploadedImage.status }));

    if (_.isEqual(uploadedImagesArray, ['successful']) || _.isEqual(uploadedImagesArray, [])) {
      if (prevState.isButtonDisabled) {
        this.setState({ isButtonDisabled: false });
      }
    } else {
      if (!prevState.isButtonDisabled) {
        this.setState({ isButtonDisabled: true });
      }
    }
  }

  constructor(props) {
    super(props);

    if (this.props.selectedMaintenanceTask) {
      let task = this.props.selectedMaintenanceTask;
      let priority = task.priority.split('_')[0];

      this.state = {
        priority: { label: priority, value: priority },
        formButtonText: 'Edit',
        title: task.title,
        description: task.description,
        venue: { label: task.venue.name, value: task.venue.id },
        taskUuid: uuid(),
        uploadedImages: this.setFileObjects(),
        isButtonDisabled: false
      }
    } else {
      let venue = this.props.venues[0];

      this.state = {
        priority: 'high',
        formButtonText: 'Create',
        title: '',
        description: '',
        venue: { label: venue.name, value: venue.id },
        taskUuid: uuid(),
        uploadedImages: this.setFileObjects(),
        isButtonDisabled: false
      }
    }
  }

  setFileObjects() {
    if (this.props.selectedMaintenanceTask) {
      return this.props.selectedMaintenanceTask.maintenanceTaskImages.map((maintenanceTaskImage) => {
        return {
          uuid: uuid(),
          fileObject: null,
          response: maintenanceTaskImage,
          status: 'successful',
          key: Math.random(),
        };
      });
    } else {
      return [];
    }
  }

  handlePriorityChange(object) {
    this.setState({ priority: object.value });
  }

  handleVenueChange(object) {
    this.setState({ venue: object });
  }

  renderOption(option) {
    return (
      <span>
        <span className={ `Select-color-indicator Select-color-indicator_priority_${option.label}` }></span> { option.label }
      </span>
    );
  }

  priorityOptions() {
    return this.props.priorities.map((priority) => {
      return { label: priority, value: priority, className: 'Select-value_priority_' + priority, optionClassName: '' }
    });
  }

  venueOptions() {
    return this.props.venues.map((venue) => {
      return { label: venue.name, value: venue.id }
    });
  }

  getMaintenanceTaskImageIds() {
    return this.state.uploadedImages.map((uploadedImage) => {
      return uploadedImage.response.id;
    });
  }

  handleCreateSubmit() {
    this.setState({ formButtonText: 'Creating...' });

    this.props.tempMaintenanceTasks.find((tempMaintenanceTask) => {
      return this.state.taskUuid == tempMaintenanceTask.maintenanceTaskId
    });

    this.props.createTask({
      title: this.state.title,
      description: this.state.description,
      priority: this.state.priority + '_priority',
      venue_id: this.state.venue.value,
      maintenance_task_image_ids: this.getMaintenanceTaskImageIds(),
    }).then((argument) => {
      this.queryMaintenanceTasks();
      this.setState({ formButtonText: 'Created', description: '', title: '' });
      this.props.setFrontendState({ showNewTaskModal: false });
      this.formReset();
    });
  }

  formReset() {
    this.props.forms.forms.maintenanceTask.title.touched = false
    this.props.forms.forms.maintenanceTask.title.valid = true
    this.props.forms.forms.maintenanceTask.title.pristine = false

    this.props.forms.forms.maintenanceTask.description.touched = false
    this.props.forms.forms.maintenanceTask.description.valid = true
    this.props.forms.forms.maintenanceTask.description.pristine = false
  }

  handleEditSubmit() {
    this.setState({ formButtonText: 'Editing...' });

    this.props.editMaintenanceTask({
      id: this.props.selectedMaintenanceTask.id,
      title: this.state.title,
      description: this.state.description,
      priority: this.state.priority.value + '_priority',
      venue_id: this.state.venue.value,
      maintenance_task_image_ids: this.props.selectedMaintenanceTask.maintenanceTaskImageIds
    }).then((argument) => {
      this.queryMaintenanceTasks();
      this.setState({ formButtonText: 'Edited' });
      this.props.setFrontendState({ showNewTaskModal: false });
      this.formReset();
    });
  }

  handleSubmit() {
    if (this.props.selectedMaintenanceTask) {
      this.handleEditSubmit();
    } else {
      this.handleCreateSubmit();
    }
  }

  queryMaintenanceTasks() {
    let startDate, endDate;

    if (this.props.filter.startDate) {
      startDate = this.props.filter.startDate.format('DD/MM/YYYY');
    }

    if (this.props.filter.endDate) {
      endDate = this.props.filter.endDate.format('DD/MM/YYYY');
    }

    this.props.queryMaintenanceTasks({
      startDate: startDate,
      endDate: endDate,
      statuses: this.props.filter.statuses,
      priorities: this.props.filter.priorities,
      venues: this.props.filter.venues,
      page: 1
    });
  }

  getClassName(props) {
    let extraClass = '';

    if (props.component === 'textarea') {
      extraClass = 'boss-form__textarea_size_large';
    }

    if (props.fieldValue.pristine) {
      return `boss-form__${props.component} ${extraClass}`;
    }

    if (props.fieldValue.touched && !props.fieldValue.valid) {
      return `boss-form__${props.component} ${extraClass} boss-form__${props.component}_state_error`;
    } else {
      return `boss-form__${props.component} ${extraClass}`;
    }
  }

  renderError(prop) {
    return (
      <p className="boss-form__error-text">
        <span className="boss-form__error-line">{ prop.children }</span>
      </p>
    );
  }

  getValueForTitle(e, props) {
    if (e.target) {
      this.setState({ title: e.target.value });

      return e.target.value;
    }
  }

  getValueForDescription(e, props) {
    if (e.target) {
      this.setState({ description: e.target.value });

      return e.target.value;
    }
  }

  setUploadedImages(image) {
    let uploadedImages = this.state.uploadedImages;

    let existingImage = uploadedImages.find((uploadedImage) => {
      return image.uuid == uploadedImage.uuid;
    });

    if (existingImage) {
      uploadedImages = uploadedImages.map((uploadedImage) => {
        if (uploadedImage.uuid == existingImage.uuid) {
          return existingImage;
        } else {
          return uploadedImage
        }
      })
    } else {
      uploadedImages.push(image);
    }

    this.setState({ uploadedImages: uploadedImages });
  }

  deleteImage(image) {
    let uploadedImages = this.state.uploadedImages;
    let existingImage = uploadedImages.find((uploadedImage) => {
      return image.uuid == uploadedImage.uuid;
    });

    if (existingImage) {
      let index = uploadedImages.indexOf(existingImage);

      if (index > -1) {
        uploadedImages.splice(index, 1);
      }
    }

    this.setState({ uploadedImages: uploadedImages });
  }

  commonProps() {
    let { ...props } = this.props;

    props = Object.assign(props, {
      taskUuid: this.state.taskUuid,
      setUploadedImages: this.setUploadedImages.bind(this),
      deleteImage: this.deleteImage.bind(this),
      uploadedImages: this.state.uploadedImages
    });

    return props;
  }

  render() {
    return (
      <Form model="maintenanceTask" className="boss-form" onSubmit={ this.handleSubmit.bind(this) } encType="multipart/form-data">
        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_role_label-extra-small boss-form__field_position_last">
            <p className="boss-form__label"><span className="boss-form__label-text boss-form__label-text_type_inline-fluid">Title</span></p>
          </div>

          <div className="boss-form__field boss-form__field_layout_max">
            <label className="boss-form__label">
              <Control.text
                id="title"
                value={ this.state.title }
                getValue={ this.getValueForTitle.bind(this) }
                mapProps={{
                  className: this.getClassName.bind(this)
                }}
                model=".title"
                placeholder="title"
                required
                validateOn={ ['change'] }
              />

              <Errors
                component={ this.renderError.bind(this) }
                className="boss-form__error"
                model=".title"
                show="touched"
                messages={{
                  valueMissing: 'This is a required field!',
                }}
              />
            </label>
          </div>
        </div>

        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_role_label-extra-small boss-form__field_position_last">
            <p className="boss-form__label"><span className="boss-form__label-text boss-form__label-text_type_inline-fluid">Priority</span></p>
          </div>

          <div className="boss-form__field boss-form__field_layout_max">
            <div className="boss-form__select">
              <Select
                name="priority"
                onChange={ this.handlePriorityChange.bind(this) }
                options={ this.priorityOptions() }
                placeholder="Select Priority"
                value={ this.state.priority }
                searchable={ false }
                clearable={ false }
                optionRenderer={ this.renderOption.bind(this) }
                valueRenderer={ this.renderOption.bind(this) }
              />
            </div>
          </div>
        </div>

        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_role_label-extra-small boss-form__field_position_last">
            <p className="boss-form__label"><span className="boss-form__label-text boss-form__label-text_type_inline-fluid">Venue</span></p>
          </div>

          <div className="boss-form__field boss-form__field_layout_max">
            <div className="boss-form__select">
              <Select
                name="venue"
                onChange={ this.handleVenueChange.bind(this) }
                options={ this.venueOptions() }
                placeholder="Select Venue"
                value={ this.state.venue }
                searchable={ false }
                clearable={ false }
              />
            </div>
          </div>
        </div>

        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_role_label-extra-small boss-form__field_position_last">
            <p className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">Description</span>
            </p>
          </div>

          <div className="boss-form__field boss-form__field_layout_max">
            <Control.textarea
              id="description"
              value={ this.state.description }
              getValue={ this.getValueForDescription.bind(this) }
              mapProps={{
                className: this.getClassName.bind(this)
              }}
              model=".description"
              placeholder="description"
              required
              validateOn={ ['change'] }
            />

            <Errors
              component={ this.renderError.bind(this) }
              className="boss-form__error"
              model=".description"
              show="touched"
              messages={{
                valueMissing: 'This is a required field!',
              }}
            />
          </div>
        </div>

        <div className="boss-form__row boss-form__row_position_last">
          <ImageForm { ...this.commonProps() } />
        </div>

        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_role_label-extra-small boss-form__field_position_last"></div>
          <div className="boss-form__field boss-form__field_layout_max boss-form__field_justify_mobile-center">
            <button
              className="boss-button boss-button_role_add boss-form__submit"
              type="submit"
              disabled={ this.state.isButtonDisabled }
            >
              { this.state.formButtonText }
            </button>
          </div>
        </div>
      </Form>
    );
  }
}
