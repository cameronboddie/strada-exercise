import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import { NewContent } from '../types/models.ts';
import { useCreateContentMutation } from '../services/api.ts';

interface CreateContentDialogProps {
  open: boolean;
  onClose: () => void;
  collectionId: number;
}

export default function CreateContentDialog({
                                              open,
                                              onClose,
                                              collectionId,
                                            }: CreateContentDialogProps) {
  const { handleSubmit, control, reset } = useForm<NewContent>({
    defaultValues: {
      title: '',
      artist: '',
      medium: 'Art', // Default to "Art"
      year: new Date().getFullYear(),
      image_url: '',
      collection_id: collectionId,
    },
  });

  const [createContent, { isLoading, error }] = useCreateContentMutation();

  const onSubmit = async (data: NewContent) => {
    try {
      const sanitizedData: NewContent = {
        ...data,
        height: data.height ?? undefined,
        width: data.width ?? undefined,
        depth: data.depth ?? undefined,
      };
      await createContent(sanitizedData).unwrap();
      onClose();
      reset();
    } catch (err) {
      console.error('Error creating content:', err);
    }
  };

  return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Content</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => <TextField {...field} margin="dense" label="Title" fullWidth variant="outlined" />}
            />
            <Controller
                name="artist"
                control={control}
                render={({ field }) => <TextField {...field} margin="dense" label="Artist" fullWidth variant="outlined" />}
            />
            <Controller
                name="medium"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        margin="dense"
                        label="Medium"
                        fullWidth
                        variant="outlined"
                    >
                      <MenuItem value="Art">Art</MenuItem>
                      <MenuItem value="Photography">Photography</MenuItem>
                    </TextField>
                )}
            />
            <Controller
                name="year"
                control={control}
                render={({ field }) => (
                    <TextField {...field} margin="dense" label="Year" fullWidth type="number" variant="outlined" />
                )}
            />
            <Controller
                name="image_url"
                control={control}
                render={({ field }) => <TextField {...field} margin="dense" label="Image URL" fullWidth variant="outlined" />}
            />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField {...field} margin="dense" label="Description" fullWidth multiline rows={3} variant="outlined" />
                )}
            />
            {error && (
                <p style={{ color: 'red' }}>
                  Error creating content
                </p>
            )}
            <DialogActions>
              <Button onClick={onClose} color="secondary" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
  );
}