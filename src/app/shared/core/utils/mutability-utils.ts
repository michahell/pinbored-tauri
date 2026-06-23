import { Immutable } from 'signalstory'
import { DeepWritable } from 'ts-essentials'

const asDeepMutable = <T>(data: Immutable<T[]>): DeepWritable<T>[] => {
  return data as DeepWritable<T>[]
}

export { asDeepMutable }
