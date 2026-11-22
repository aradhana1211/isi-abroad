// * while using this enum, value for comparison must be lower-case
export enum StatusEnum {
  ACCEPTED = 'accepted',
  CONFIRM = 'confirm',
  INCOMPLETE = 'incomplete',
  PENDING = 'pending',
  CONDITIONAL = 'conditional',
  REJECT = 'reject',
  WITHDRAW = 'withdraw',
  COMPLETED = 'completed',
  NEW = 'new',
  ARCHIVE = 'archive',
  PROCESSING = 'processing'
}

export const AppStatusStyle: AppStatusType = {
  [StatusEnum.NEW]: { backgroundColor: '#dfefff', color: '#000' },
  [StatusEnum.ACCEPTED]: { backgroundColor: '#4caf50' },
  [StatusEnum.PROCESSING]: { backgroundColor: '#ffd89b', color: '#000' },
  [StatusEnum.CONDITIONAL]: { backgroundColor: '#ffc107', color: '#000' },
  [StatusEnum.REJECT]: { backgroundColor: '#f44336' },
  [StatusEnum.CONFIRM]: { backgroundColor: '#2196f3' },
  [StatusEnum.WITHDRAW]: { backgroundColor: '#fa1d0e' },
  [StatusEnum.ARCHIVE]: { backgroundColor: '#9c0000' }
}

export interface AppStatusType {
  [key: string]: any
}
