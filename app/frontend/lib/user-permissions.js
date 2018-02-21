import oFetch from 'o-fetch';

export const userPermissions = {
  marketingTasks: {
    canViewPage: function(permissions) {
      return !!permissions['canViewPage'];
    },

    canCreateTask: function(permissions) {
      return !!permissions['canCreateTask'];
    },

    canViewTask: function(permissions) {
      return !!permissions['canViewTask'];
    },

    canAssignTask: function(permissions) {
      return !!permissions['canAssignTask'];
    },

    canUpdateStatusTask: function(permissions) {
      return !!permissions['canUpdateStatusTask'];
    },

    canCreateNoteTask: function(permissions) {
      return !!permissions['canCreateNoteTask'];
    },

    canUpdateTask: function(permissions) {
      return !!permissions['canUpdateTask'];
    },

    canDestroyTask: function(permissions) {
      return !!permissions['canDestroyTask'];
    },

    canRestoreTask: function(permissions) {
      return !!permissions['canRestoreTask'];
    }
  }
}
