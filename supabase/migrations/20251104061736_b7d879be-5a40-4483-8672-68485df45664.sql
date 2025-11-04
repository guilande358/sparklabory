-- Fix infinite recursion in RLS policies by simplifying project_members policies

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view project members for projects they access" ON project_members;
DROP POLICY IF EXISTS "Project owners can add members" ON project_members;
DROP POLICY IF EXISTS "Project owners can remove members" ON project_members;

-- Create simpler policies that don't reference projects table
CREATE POLICY "Members can view their memberships"
  ON project_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert for authenticated users"
  ON project_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow delete for authenticated users"
  ON project_members FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Also simplify the projects SELECT policy to avoid recursion
DROP POLICY IF EXISTS "Users can view projects they own or are members of" ON projects;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

-- Add a separate policy for viewing projects where user is a member
-- This is safe because it only checks project_members without referencing back to projects
CREATE POLICY "Users can view projects they are members of"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );