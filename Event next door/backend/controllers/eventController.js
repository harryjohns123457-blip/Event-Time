const supabase = require('../config/supabase');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: events, count, error } = await query
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch events',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: err.message
    });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        users(first_name, last_name, email),
        reviews(id, rating, review_text, users(first_name))
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: err.message
    });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, category, start_date, end_date, location, max_attendees, price } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, start_date, and end_date are required'
      });
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert([{
        title,
        description,
        category,
        start_date,
        end_date,
        location,
        organizer_id: req.user.id,
        max_attendees,
        price: price || 0
      }])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create event',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: err.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user is the organizer
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();

    if (fetchError || event.organizer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update event',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: err.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is the organizer
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();

    if (fetchError || event.organizer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete event',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: err.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
