import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Typography,
} from '@mui/material';
import { useCreateCollectionMutation } from '../services/api.ts';
import {useView} from "../ context/ViewContext.tsx";
import {useNavigate} from "react-router-dom";

type CreateCollectionDialogProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  collectionName: string;
  description: string;
  team: string;
  tags: string;
};

export default function CreateCollectionDialog({ open, onClose }: CreateCollectionDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      collectionName: '',
      description: '',
      team: '',
      tags: '',
    },
  });
  const { selectedTeam } = useView()
  const navigate = useNavigate()

  // RTK Query mutation hook for creating a new collection
  const [createCollection, { isLoading, error: mutationError }] = useCreateCollectionMutation();

  const maxDescriptionLength = 500;

  const onSubmit = async (data: FormValues) => {
    // Map form fields to your backend's expected payload shape.
    // - collectionName maps to "name"
    // - team is sent as an array in "assigned_teams"
    // - tags are expected as an array; we assume a comma-separated input.
    const parsedTags =        data.tags.trim() !== ''
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];
    const payload = {
      name: data.collectionName,
      description: data.description,
      // @ts-ignore
      team_id: selectedTeam.id,
      tags: parsedTags,
    };

    try {
      // Await the mutation and unwrap the result.
      const result = await createCollection(payload).unwrap();
      console.log('Created collection:', result);
      reset(); // Clear form after successful submission
      onClose();// Close dialog
      navigate(`collections/${result.id}`)
    } catch (err) {
      console.error('Failed to create collection:', err);
      // The error object (err) may include backend validation errors in err.data
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Start a collection to categorize and manage your content.
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Collection Name */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Controller
              name="collectionName"
              control={control}
              rules={{ required: 'Collection Name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Collection Name"
                  required
                  error={!!errors.collectionName}
                  helperText={errors.collectionName?.message}
                />
              )}
            />
          </FormControl>

          {/* Description */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Description is required',
                maxLength: {
                  value: maxDescriptionLength,
                  message: `Max ${maxDescriptionLength} characters allowed`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  required
                  minRows={5}
                  error={!!errors.description}
                  helperText={
                    errors.description?.message
                              || `${field.value.length}/${maxDescriptionLength} characters`
                  }
                />
              )}
            />
          </FormControl>
          {/* Tags Input */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tags"
                  variant="outlined"
                  placeholder="+ Add Tag (comma separated)"
                  fullWidth
                />
              )}
            />
          </FormControl>

          {/* Optionally display error from the mutation */}
          {mutationError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {mutationError && 'Error creating collection. Please check your input.'}
            </Typography>
          )}

          <DialogActions sx={{ mt: 2 }}>
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Collection'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
