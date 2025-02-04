import { useDrag, useDrop } from 'react-dnd';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CollectionCard, { CollectionCardProps } from './CollectionCard.tsx';

const ITEM_TYPE = 'COLLECTION';

interface DraggableCollectionCardProps {
  card: CollectionCardProps;
  index: number;
  updateParent: (draggedId: string, targetId: string) => void;
  onDropAttempt?: () => void;
}

export function DraggableCollectionCard({
                                          card, index, updateParent, onDropAttempt,
                                        }: DraggableCollectionCardProps) {
  const navigate = useNavigate();

  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index, id: card.id as string }, // Ensure `id` is included
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop<{ index: number; id: string }>({
    accept: ITEM_TYPE,
    drop: (draggedItem) => {
      if (draggedItem.id !== card.id) {
        updateParent(draggedItem.id, card.id as string);
      }
    },
    hover: (_draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true }) && onDropAttempt) {
        onDropAttempt();
      }
    },
  });

  // Combine the drag and drop refs
  const combinedRef = (node: HTMLElement | null) => {
    dragRef(node);
    dropRef(node);
  };

  const handleNavigate = () => {
    navigate(`/collections/${card.id}`);
  };

  return (
      <Grid
          size={{ xs: 12, sm: 6, lg: 3 }}
          ref={combinedRef}
          sx={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <Box sx={{ cursor: 'pointer' }} onClick={handleNavigate}>
          <CollectionCard {...card} />
        </Box>
      </Grid>
  );
}