import { PipelineStage } from 'mongoose';

/**
 * Adds a standard $lookup and subsequent $unwind stage to a pipeline.
 * Use preserveNullAndEmptyArrays: true to ensure documents without a match are returned.
 * @param pipeline - The array of PipelineStages to modify.
 * @param localField - The field on the current collection to join from.
 * @param foreignField - The field on the 'from' collection to join to (defaults to '_id').
 * @param from - The name of the collection to join.
 */
export const addLookup = (
  pipeline: PipelineStage[],
  localField: string,
  foreignField: string,
  from: string,
  isArray: boolean
) => {
  pipeline.push({
    $lookup: {
      from,
      localField,
      foreignField,
      as: localField,
    },
  });
  if (!isArray)
    pipeline.push({
      $unwind: { path: `$${localField}`, preserveNullAndEmptyArrays: true },
    });
};
